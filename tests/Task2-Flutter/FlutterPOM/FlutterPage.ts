import { Page, Locator, expect } from '@playwright/test';
import { smartClick } from './Utils-Flutter';

export class FlutterPage {
  page: Page;
  placeholder: Locator;
  incrementBtn: Locator;
  private readonly BASE_URL = 'https://flutter-angular.web.app/#/';

  constructor(page: Page) {
    this.page = page;

    // accasability placeholder element to enable semantics
    this.placeholder = page.locator('flt-semantics-placeholder');

    //try to find increment button by aria-label first
    this.incrementBtn = page.locator('flt-semantics[aria-label="Increment"]').first();
  }

  async goto() {
    await this.page.goto(this.BASE_URL, { waitUntil: 'networkidle' });
  }

  async enableSemantics() {
    // wait until the hidden element appears 
    await this.placeholder.waitFor({ state: 'attached' });

    // Calculate the exact coordinates (X and Y) of this element 
    const box = await this.placeholder.boundingBox();
    if (!box) throw new Error('Semantics placeholder not visible');

    // click the center of the placeholder to activate semantics
    await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    await this.page.waitForSelector('flt-semantics', { timeout: 10000 });
  }

  async incrementCounter(): Promise<void> {
    await smartClick(this.page, this.incrementBtn);
  }


  async getCounterValue(expectedValue?: number): Promise<number> {
    if (expectedValue !== undefined) {
      // --- Explicit Wait ---
      await this.page.waitForFunction((expected) => {
        const elements = Array.from(document.querySelectorAll('flt-semantics, [aria-label]'));
        const labels = elements.map(el => el.getAttribute('aria-label') || "");
        const label = labels.find(l => l.includes('Index:') || (/^\d+$/.test(l.trim())));
        const match = label?.match(/\d+/);
        return match ? parseInt(match[0]) === expected : false;
      }, expectedValue, { timeout: 15000 });
    }

    return await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('flt-semantics, [aria-label]'));
      const labels = elements.map(el => el.getAttribute('aria-label') || "");
      
      // to search for a label that contains "Index:" or is just a number (to handle different possible formats)
      const label = labels.find(l => l.includes('Index:') || (/^\d+$/.test(l.trim())));
      const match = label?.match(/\d+/);
      
      return match ? parseInt(match[0]) : 0;
    });
  }

  ///// Click on a neutral area of the screen (coordinates 10,10) to test that 
  // the counter does NOT change when interacting outside the increment button.
  async clickNeutralArea(): Promise<void> {
    await this.page.mouse.click(10, 10);
  }
}

//   async getCounterValue(): Promise<number> {
//     return await this.page.evaluate(() => {
//       const elements = Array.from(document.querySelectorAll('flt-semantics'));
//       const label = elements
//         .map(el => el.getAttribute('aria-label') || '')
//         .find(l => l.includes('Index:'));
//       const match = label?.match(/\d+/);
//       return match ? parseInt(match[0]) : 0;
//     });
//   }