import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { FlutterPage } from '../../FlutterPOM/FlutterPage';

setDefaultTimeout(60000);
let valueBefore: number = 0;

Given('navigate to the Flutter Angular app', async function () {
    this.flutterPage = new FlutterPage(this.page);
    await this.flutterPage.goto();
});

Given('enable Flutter accessibility semantics', async function () {
    console.log(" Activating Flutter semantics...");
    await this.flutterPage.enableSemantics();
});

When('I click the "+" increment button', async function () {
    // get the value before clicking 
    valueBefore = await this.flutterPage.getCounterValue();
    
    // 
    const image = await this.page.screenshot({ fullPage: true });
    this.attach(image, 'image/png');
    
    await this.flutterPage.incrementCounter();
});

When('I click on a neutral area of the screen', async function () {
    valueBefore = await this.flutterPage.getCounterValue();
    
    // --- take screenshot before clicking neutral area ---
    const image = await this.page.screenshot({ fullPage: true });
    this.attach(image, 'image/png');
    
    await this.flutterPage.clickNeutralArea();
});


When('I refresh the page', async function () {
    // 1. Perform the actual browser reload
    console.log("Refreshing the page...");
    await this.page.reload();

    // 2. IMPORTANT: Re-enable Flutter semantics 
    // Because a refresh clears the accessibility tree
    console.log("Re-activating Flutter semantics after refresh...");
    await this.flutterPage.enableSemantics();

    // 3. Take a screenshot to document the reset state in the report
    const image = await this.page.screenshot({ fullPage: true });
    this.attach(image, 'image/png');
});

// Then('The counter should display {string}', async function (expectedValue: string) {
// ... (Your original commented code)
// });

Then('The counter should display {string}', async function (expectedValue: string) {
    const matchFromFeature = expectedValue.match(/\d+/);
    const expectedNum = matchFromFeature ? parseInt(matchFromFeature[0]) : 0;

    // --- Explicit Wait ---
    if (expectedNum > valueBefore) {
        try {
            // Semantics Tree wait until the expected value appears
            await this.page.waitForFunction(
                (expected: number) => {
                    const elements = Array.from(document.querySelectorAll('flt-semantics, [aria-label]'));
                    const label = elements.map(el => el.getAttribute('aria-label') || "")
                                          .find(l => l.includes('Index:') || /^\d+$/.test(l.trim()));
                    const match = label?.match(/\d+/);
                    return match ? parseInt(match[0]) === expected : false;
                },
                expectedNum,
                { timeout: 15000 } 
            );
        } catch (e) {
            const allLabels = await this.page.evaluate(() => 
                Array.from(document.querySelectorAll('flt-semantics, [aria-label]'))
                     .map(el => el.getAttribute('aria-label'))
                     .filter(l => l)
            );
            console.log("Explicit Wait Timeout. Labels found:", allLabels);
            throw e; 
        }
    } else {
       // wait a moment to check that the value does NOT change when clicking neutral area
        await this.page.waitForTimeout(1000);
    }

    const valueNow = await this.flutterPage.getCounterValue();

    // --- take screenshot AFTER action ---
    const finalImage = await this.page.screenshot({ fullPage: true });
    this.attach(finalImage, 'image/png');

    console.log(` Final Check: Expected=${expectedNum}, Now=${valueNow}`);
    expect(valueNow).toBe(expectedNum);
});



//////////////////////////////////////////


// import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
// import { expect } from '@playwright/test';
// import { smartClick } from '../../FlutterPOM/Utils-Flutter';

// setDefaultTimeout(60000);
// // Variable to store the value before clicking
// let valueBefore: number = 0;

// Given('navigate to the Flutter Angular app', { timeout: 60000 }, async function () {
//     await this.page.goto('https://flutter-angular.web.app/#/', { waitUntil: 'load' });
//     await this.page.waitForTimeout(3000); // Wait for Canvas to load
// });

// Given('enable Flutter accessibility semantics', { timeout: 60000 }, async function () {
//     console.log(" Attempting Hard Activation of Semantics...");

//     // will wait to Activating the ‘Hidden Eye’ (Semantics)
//     const placeholder = this.page.locator('flt-semantics-placeholder');
//     await placeholder.waitFor({ state: 'attached' });

//     /// Calculate the exact coordinates (X and Y) of this element,
//     /// then tap its center.
//     ///
//     /// Result: This tap tells Flutter to enable Accessibility mode,
//     /// causing it to render transparent accessibility layers over the Canvas.

//     const box = await placeholder.boundingBox();
//     if (box) {
//         await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
//     }

//     await this.page.waitForTimeout(5000); // وقت كافٍ لبناء الشجرة
// });


// When('I click the "+" increment button', { timeout: 60000 }, async function () {
//     const btn = this.page.locator('flt-semantics[aria-label="Increment"]').first();

//     // Capture the value before clicking to avoid flaky test behavior.
//        await smartClick(this.page, btn);

//     await this.page.waitForTimeout(2000);
// });

// When('I click on a neutral area of the screen', { timeout: 60000 }, async function () {
//     await this.page.mouse.click(10, 10);
//     await this.page.waitForTimeout(1000);
// });

// // Dynamic comparison logic (Before vs After)
// Then('The counter should display {string}', { timeout: 60000 }, async function (expectedValue: string) {
//     // Extract the expected number from the Gherkin string (e.g., "1" from "Index: 1")
//     const expectedFromFeature = parseInt(expectedValue.match(/\d+/)![0]);

//     // Read the current labels from the browser
//     const result = await this.page.evaluate(() => {
//         const elements = Array.from(document.querySelectorAll('flt-semantics, [aria-label]'));
//         const labels = elements.map(el => el.getAttribute('aria-label') || "").filter(l => l !== "");
//         return labels;
//     });

//     const currentLabel = result.find((l: string) => l.includes('Index: ') || (/\d+/.test(l) && l.length < 15));
//     const match = currentLabel?.match(/\d+/);
//     const valueNow = match ? parseInt(match[0]) : -1;

//     console.log(`Result Analysis:`);
//     console.log(`   - Value BEFORE interaction: ${valueBefore}`);
//     console.log(`   - Value NOW: ${valueNow}`);

//     // Verification Logic:
//     if (expectedFromFeature > 0) {
//         // If the scenario expects an increase
//         expect(valueNow).toBe(valueBefore + 1);
//         console.log(`Success: Value incremented from ${valueBefore} to ${valueNow}`);
//     } else {
//         // If the scenario expects no change (stays at zero/current)
//         expect(valueNow).toBe(valueBefore);
//         console.log(`Success: Value remained stable at ${valueNow}`);
//     }
// });