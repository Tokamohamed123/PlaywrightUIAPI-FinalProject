import basePage from "./basePage";
import { Locator, Page, expect } from "@playwright/test";

export default class MandatoryDetailsPage extends basePage {
  // ////////////////Locators//////////////////
  private readonly emailInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly phoneInput: Locator;
  private readonly completeOrderBtn: Locator;
  private readonly shippingMethodSection: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator("input[name='email']").first();
    this.lastNameInput = page.locator("input[name='lastName']").first();
    this.addressInput = page.locator("input[name='address1']").first();
    this.phoneInput = page.locator("input[name='phone'], input[type='tel']").first();
    this.completeOrderBtn = page.locator("button[type='submit'], button[data-test-id='checkout-pay-button'], #checkout-pay-button, .pay-button, .checkout-pay-button").first();
    this.shippingMethodSection = page.locator("#shipping_methods");
 
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
   const firstOption = this.page.locator('[role="option"]').first();
    await firstOption.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await firstOption.isVisible()) {
      await firstOption.click();
    } else {
      await this.page.keyboard.press('Enter');
    }

    // Explicit Wait to check if address suggestions appear and choose the first one
    await this.shippingMethodSection.waitFor({ state: 'visible', timeout: 15000 });
    console.log('Phone input is ready');
  }

  async enterPhone(phone: string) {
    console.log('Starting to fill phone:', phone);
    await this.phoneInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.enterTextToElement(this.phoneInput, phone);
    
    await this.completeOrderBtn.scrollIntoViewIfNeeded();
    await expect(this.completeOrderBtn).toBeEnabled({ timeout: 10000 });
  }

//  async completeOrder() {
//     await this.page.keyboard.press('Tab'); 

//     const completeOrderBtn = this.page.locator('#checkout-pay-button');
//     await expect(completeOrderBtn).toBeEnabled({ timeout: 10000 });
//     await completeOrderBtn.click({ force: true });

   
 
//   }
async completeOrder() {
    await this.completeOrderBtn.waitFor({ state: 'visible', timeout: 10000 });
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

  async getPaymentErrorMessage() {
    const banner = this.page.locator('#PaymentErrorBanner');
    await banner.waitFor({ state: 'visible' });
    return banner;
}
}