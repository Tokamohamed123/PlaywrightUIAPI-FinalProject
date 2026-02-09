import basePage from "./basePage";
import { Locator, Page, expect } from "@playwright/test";

export default class MandatoryDetailsPage extends basePage {
  // ////////////////Locators//////////////////
  private readonly emailInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly phoneInput: Locator;
  private readonly completeOrderBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator("input[name='email']").first();
    this.lastNameInput = page.locator("input[name='lastName']").first();
    this.addressInput = page.locator("input[name='address1']").first();
    this.phoneInput = page.locator("input[name='phone'], input[type='tel']").first();
    this.completeOrderBtn = page.locator("button[type='submit'], button[data-test-id='checkout-pay-button'], #checkout-pay-button, .pay-button, .checkout-pay-button").first();
  }

  // methods
  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.enterTextToElement(this.emailInput, email);
  }

  async enterLastName(lastName: string) {
    await this.lastNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.enterTextToElement(this.lastNameInput, lastName);
  }

  async fillAddress(address: string) {
    console.log('Starting to fill address:', address);
    
    // Clear any existing content and fill the address
    await this.addressInput.waitFor({ timeout: 10000 });
    await this.addressInput.clear();
    await this.addressInput.fill(address);
    
    // Wait for address suggestions to appear (Google Maps or similar auto-complete)
    await this.page.waitForTimeout(2000);
    
    // Check if address suggestions appear and handle them if they do
    const addressOptions = this.page.locator('[role="option"]');
    const optionCount = await addressOptions.count();
    
    if (optionCount > 0) {
      console.log('Found address suggestions, selecting first one');
      // Select the first suggestion
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      
      // Wait for suggestions to disappear and address to be populated
      await this.page.waitForTimeout(1000);
      
      // Verify the address field has been updated with the selected suggestion
      const filledAddress = await this.addressInput.inputValue();
      console.log('Address after selection:', filledAddress);
    } else {
      console.log('No address suggestions found, using manually entered address');
    }
    
    // Wait for phone input to be ready
    await this.phoneInput.waitFor({ timeout: 10000 });
    console.log('Phone input is ready');
  }

  async enterPhone(phone: string) {
    console.log('Starting to fill phone:', phone);
    
    // Wait for phone input to be ready
    await this.phoneInput.waitFor({ timeout: 15000 });
    console.log('Phone input is ready');
    
    await this.enterTextToElement(this.phoneInput, phone);
    console.log('Phone number filled successfully');
    
    // Wait for any network activity to settle
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    // Scroll down to ensure the Complete Order button is in view
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    console.log('Scrolled to bottom of page');
    
    // Wait for the Complete Order button to be visible and enabled
    await this.completeOrderBtn.waitFor({ timeout: 10000 });
    console.log('Complete Order button is visible');
    
    // Check if button is enabled before clicking
    const isButtonEnabled = await this.completeOrderBtn.isEnabled();
    if (isButtonEnabled) {
      console.log('Complete Order button is enabled');
    } else {
      console.log('Complete Order button is not enabled yet, waiting...');
      // Wait for the button to become enabled by checking periodically
      let attempts = 0;
      const maxAttempts = 10;
      while (!await this.completeOrderBtn.isEnabled() && attempts < maxAttempts) {
        await this.page.waitForTimeout(1000);
        attempts++;
      }
      if (await this.completeOrderBtn.isEnabled()) {
        console.log('Complete Order button is now enabled');
      } else {
        console.log('Complete Order button is still not enabled after waiting');
      }
    }
  }

//  async completeOrder() {
//     await this.page.keyboard.press('Tab'); 

//     const completeOrderBtn = this.page.locator('#checkout-pay-button');
//     await expect(completeOrderBtn).toBeEnabled({ timeout: 10000 });
//     await completeOrderBtn.click({ force: true });

   
 
//   }
async completeOrder() {
    // Wait for the Complete Order button to be visible and enabled
    await this.completeOrderBtn.waitFor({ timeout: 15000 });
    
    // Scroll the button into view
    await this.completeOrderBtn.scrollIntoViewIfNeeded();
    
    // Click the button
    await this.completeOrderBtn.click();
    
    // Wait for the page to load after clicking
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
}

  /**
   *(Action Method) - ا
   */
  async fillAllMandatoryDetails(data: { email: string, lastName: string, address: string, phone: string }) {
    await this.fillEmail(data.email);
    await this.enterLastName(data.lastName);
    await this.fillAddress(data.address);
    await this.enterPhone(data.phone);
  }
}