import { Locator, Page } from "@playwright/test";


export default class basePage {
    protected readonly page:Page;
    constructor(page:Page) {
        this.page=page;
    }

       protected async enterTextToElement(element: Locator, text: string) {
        // const target = element.first();
  
        await element.scrollIntoViewIfNeeded();           
        await element.waitFor({ state: 'visible', timeout: 10000 });  
        await element.fill(text);                        
    }

    protected async clickOnElement(element: Locator) {
        await element.scrollIntoViewIfNeeded();
        await element.waitFor({ state: 'visible', timeout: 10000 });
        await element.click();
    }
}