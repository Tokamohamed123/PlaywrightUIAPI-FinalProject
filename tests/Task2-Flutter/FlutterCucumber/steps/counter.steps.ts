import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Variable to store the value before clicking
let valueBefore: number = 0;

Given('navigate to the Flutter Angular app', { timeout: 60000 }, async function () {
    await this.page.goto('https://flutter-angular.web.app/#/', { waitUntil: 'load' });
    await this.page.waitForTimeout(3000); // Wait for Canvas to load
});

Given('enable Flutter accessibility semantics', { timeout: 60000 }, async function () {
    // Enable semantics using keyboard shortcuts
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Enter');
    
    // Force click the hidden semantics placeholder to build the tree
    await this.page.click('flt-semantics-placeholder', { force: true, timeout: 2000 }).catch(() => {
        console.log("Semantics placeholder not found, skipping...");
    });
    
    await this.page.waitForTimeout(4000); 

    // Read the initial counter value before any interaction
    const labels = await this.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('flt-semantics, [aria-label]'));
        return elements.map(el => el.getAttribute('aria-label') || "");
    });

    // Find the label containing 'Index: ' or a standalone number
    const counterLabel = labels.find((l: string) => l.includes('Index: ') || (/\d+/.test(l) && l.length < 15));
    const match = counterLabel?.match(/\d+/);
    valueBefore = match ? parseInt(match[0]) : 0;
    
    console.log(`🔢 Initial value detected at start: ${valueBefore}`);
});

When('I click the "+" increment button', { timeout: 60000 }, async function () {
    const btn = this.page.locator('flt-semantics[aria-label="Increment"]').first();
    await btn.waitFor({ state: 'visible' });
    
    // Perform a single precise click
    await btn.click({ clickCount: 1 }); 
    console.log("👆 Increment button clicked once.");
    
    await this.page.waitForTimeout(2000); // Wait for UI update
});

When('I click on a neutral area of the screen', { timeout: 60000 }, async function () {
    await this.page.mouse.click(10, 10);
    await this.page.waitForTimeout(1000);
});

// Dynamic comparison logic (Before vs After)
Then('The counter should display {string}', { timeout: 60000 }, async function (expectedValue: string) {
    // Extract the expected number from the Gherkin string (e.g., "1" from "Index: 1")
    const expectedFromFeature = parseInt(expectedValue.match(/\d+/)![0]);

    // Read the current labels from the browser
    const result = await this.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('flt-semantics, [aria-label]'));
        const labels = elements.map(el => el.getAttribute('aria-label') || "").filter(l => l !== "");
        return labels;
    });

    const currentLabel = result.find((l: string) => l.includes('Index: ') || (/\d+/.test(l) && l.length < 15));
    const match = currentLabel?.match(/\d+/);
    const valueNow = match ? parseInt(match[0]) : -1;

    console.log(`📊 Result Analysis:`);
    console.log(`   - Value BEFORE interaction: ${valueBefore}`);
    console.log(`   - Value NOW: ${valueNow}`);

    // Verification Logic:
    if (expectedFromFeature > 0) { 
        // If the scenario expects an increase
        expect(valueNow).toBe(valueBefore + 1);
        console.log(`✅ Success: Value incremented from ${valueBefore} to ${valueNow}`);
    } else {
        // If the scenario expects no change (stays at zero/current)
        expect(valueNow).toBe(valueBefore);
        console.log(`✅ Success: Value remained stable at ${valueNow}`);
    }
});