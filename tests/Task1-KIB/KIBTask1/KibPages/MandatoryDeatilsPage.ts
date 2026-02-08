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
    // نستخدم :visible لضمان عدم حدوث Strict Mode violation مع العناصر المخفية
    this.emailInput = page.locator("input[name='email']:visible").first();
    this.lastNameInput = page.locator("input[name='lastName']:visible").first();
    this.addressInput = page.locator("input[name='address1']:visible").first();
    // استخدام selector يغطي كل احتمالات حقل الهاتف في Shopify
    this.phoneInput = page.locator("input[name='phone']:visible, input[type='tel']:visible").first();
    // More robust locator for the Complete Order button
    this.completeOrderBtn = page.locator("button[type='submit'], button[data-test-id='checkout-pay-button'], #checkout-pay-button, .pay-button, .checkout-pay-button").first();
  }

  // methods
  async fillEmail(email: string) {

    await this.enterTextToElement(this.emailInput, email);
  }

  async enterLastName(lastName: string) {
    await this.enterTextToElement(this.lastNameInput, lastName);
  }

  async fillAddress(address: string) {
    console.log('Starting to fill address:', address);
    
    // Clear any existing content and fill the address
    await this.addressInput.clear();
    await this.addressInput.fill(address);
    await this.page.waitForTimeout(1000);
    
    // Wait for any address suggestions to appear
    await this.page.waitForTimeout(2000);
    
    // Check if address suggestions appear and handle them if they do
    try {
      const addressOptions = this.page.locator('[role="option"]');
      const optionCount = await addressOptions.count();
      
      if (optionCount > 0) {
        console.log('Found address suggestions, selecting first one');
        await addressOptions.first().waitFor({ state: 'visible', timeout: 3000 });
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
      } else {
        console.log('No address suggestions found, continuing...');
      }
    } catch (error) {
      console.log('Error handling address suggestions:', error);
    }
    
    // Wait for phone input to be ready with longer timeout
    try {
      await this.phoneInput.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Phone input is ready');
    } catch (error) {
      console.log('Phone input not found, checking if it exists...');
      const phoneInputs = await this.page.locator("input[name='phone'], input[type='tel']").count();
      console.log('Found phone inputs:', phoneInputs);
      throw error;
    }
  }
  async enterPhone(phone: string) {
    console.log('Starting to fill phone:', phone);
    
    try {
      // Wait for phone input to be ready with longer timeout
      await this.phoneInput.waitFor({ state: 'visible', timeout: 15000 });
      console.log('Phone input is ready');
      
      await this.enterTextToElement(this.phoneInput, phone);
      console.log('Phone number filled successfully');
      
      // Wait for any validation or processing to complete
      await this.page.waitForTimeout(2000);
      
      // Check if page is still active before proceeding
      if (this.page.isClosed()) {
        throw new Error('Page was closed before completing phone entry');
      }
      
      // Scroll down to ensure the Complete Order button is in view
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      console.log('Scrolled to bottom of page');
      
      // Wait for the page to stabilize after scrolling
      await this.page.waitForTimeout(1000);
      console.log('Page stabilized after scrolling');
      
      // Check if button exists before waiting
      const buttonCount = await this.completeOrderBtn.count();
      console.log('Complete Order button count:', buttonCount);
      
      if (buttonCount > 0) {
        // to check if the button is enabled before clicking
        await expect(this.completeOrderBtn).toBeEnabled({ timeout: 10000 });
        console.log('Complete Order button is enabled');
      } else {
        console.log('Complete Order button not found, trying alternative locators...');
        // Try to find any button that might be the submit button
        const submitButtons = await this.page.locator('button[type="submit"]').count();
        const checkoutButtons = await this.page.locator('button').filter({ hasText: /complete|pay|submit/i }).count();
        console.log('Submit buttons found:', submitButtons);
        console.log('Checkout-related buttons found:', checkoutButtons);
      }
    } catch (error) {
      console.log('Error in enterPhone method:', error);
      throw error;
    }
  }

  async completeOrder() {
  await this.page.keyboard.press('Tab'); 

const completeOrderBtn = this.page.locator('#checkout-pay-button');
await expect(completeOrderBtn).toBeEnabled({ timeout: 10000 });
await completeOrderBtn.click({ force: true });
      // Wait for the page to process the form submission      
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
