import basePage from "./basePage";

export default class ProductPage extends basePage {

    /////////Locators//////////////////

    // Product element
    private readonly AddTestProductToCart = this.page.locator(
        "//div[@data-testid='resource-list-grid']/div[2]//div[@data-product-id='8571523137735']"
    );
    
    // Buy Now button
    private readonly BuyNowBT = this.page.locator(
        "//button[normalize-space(text())='Buy it now']"
    );
    
    // Alternative Buy Now button selector (from working test)
    private readonly BuyNowBTAlternative = this.page.getByRole('button', { name: 'Buy it now' });

    /////////////////Methods///////////////////
    async ClickOnTestProduct() {
 const productLink = this.page.locator("product-title")
        .filter({ hasText: /^Test Product$/ })
        .locator('a')
        .first(); // .first() means if there are multiple matches, take the first one

    await this.AddTestProductToCart.waitFor({ state: 'visible', timeout: 15000 });
    await this.AddTestProductToCart.scrollIntoViewIfNeeded();
    await this.AddTestProductToCart.click({ force: true });
    
    console.log('Successfully clicked on the product');


    const buyNowBtn = this.page.getByRole('button', { name: 'Buy it now' });
    await buyNowBtn.waitFor({ state: 'visible', timeout: 15000 });
    }

    async ClickOnBuyNow() {
    await this.BuyNowBTAlternative.waitFor({ state: 'visible', timeout: 10000 });
        await this.BuyNowBTAlternative.click();
    // Wait for the URL to change to the checkout page
    await this.page.waitForURL(/.*checkout.*/, { timeout: 20000 });
    
    const emailInput = this.page.locator("input[name='email']").first();
    await emailInput.waitFor({ state: 'visible', timeout: 15000 });

    console.log('Successfully redirected to Checkout page');
        // // Wait for the product detail page to load by checking the Buy Now button
        // // Explicit Wait for the Buy Now button to be visible and clickable
        // await this.BuyNowBTAlternative.waitFor({ state: 'visible', timeout: 15000 });
        // await this.BuyNowBTAlternative.click();
        
        // // Wait for the checkout page to load
        // await this.page.waitForLoadState('domcontentloaded');
        // await this.page.waitForLoadState('networkidle'); 
    }
}
//////////////////////////////////////////////////////////////////

   
// async ClickOnBuyNow() {
//    await this.BuyNowBT.waitFor({ state: 'visible', timeout: 5000 });
//    await this.clickOnElement(this.BuyNowBT);
// }