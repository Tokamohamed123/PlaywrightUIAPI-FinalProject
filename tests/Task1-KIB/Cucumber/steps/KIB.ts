import { Given, When, Then } from "@cucumber/cucumber";
//import { expect } from "@playwright/test";
import testData from "../../../Task1-KIB/KIBTask1/TestData/testData.json";
import { expect, test } from "../../../Task1-KIB/KIBTask1/KibPages/Fixture";
import LoginPage from "../../../Task1-KIB/KIBTask1/KibPages/LoginPage";
import ProductPage from "../../../Task1-KIB/KIBTask1/KibPages/ProductPage";
import MandatoryDeatailsPage from "../../../Task1-KIB/KIBTask1/KibPages/MandatoryDeatilsPage";


Given('I navigate to the KIB demo store', async function () {
    await this.page.goto(testData.baseUrl);
});

Given('I login with valid credentials', async function () {
    // from loginPage class
    await this.loginPage.EnterPassword();
    await this.loginPage.ClickEnterBtn();
// await this.page.waitForTimeout(3000);
});

When('I select the test product and proceed to buy', async function () {

    await this.productPage.ClickOnTestProduct();
    await this.productPage.ClickOnBuyNow();
  // await expect(this.page).toHaveTitle(/.*Checkout.*/, { timeout: 10000 });
});

When('I fill the mandatory details using test data', async function () {
    // from mandatoryDeatailsPage class
    const user = testData.usUser;
   await this.mandatoryDeatailsPage.fillAllMandatoryDetails(user);
});

Then('I should complete the order successfully', async function () {
    
    await this.mandatoryDeatailsPage.completeOrder();
    const errorreachedlimit = await this.mandatoryDeatailsPage.getPaymentErrorMessage();
    await expect(errorreachedlimit).toBeVisible();
    // take screenshot after order completion and attach to the report
   const image = await this.page.screenshot();
    this.attach(image, 'image/png');
   // await this.page.waitForTimeout(3000);
});


/////negative scenario steps////////////
When('I leave the mandatory details fields empty and click the "Complete Order" button', async function () {
    await this.mandatoryDeatailsPage.completeOrder();
   // await this.page.waitForTimeout(3000);
});

Then('I should see an error message indicating that mandatory fields are required', async function () {
    // This should point to a method that checks for the visibility of the error text
   const errorMessages = [
        'Enter an email or phone number',
        'Enter a last name',
        'Enter an address',
        'Enter a city',
        'Select a state / province',
        'Enter a ZIP / postal code',
        'Enter a phone number'
    ];

    for (const msg of errorMessages) {
        await expect(this.page.getByText(msg)).toBeVisible({ timeout: 7000 });
    }
      await this.page.waitForTimeout(3000);
       // take screenshot after order completion and attach to the report
   const image = await this.page.screenshot();
    this.attach(image, 'image/png');
    }


);

