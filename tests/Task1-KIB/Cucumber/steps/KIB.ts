import { Given, When, Then } from "@cucumber/cucumber";
//import { expect } from "@playwright/test";
import testData from "../../../Task1-KIB/KIBTask1/TestData/testData.json";
import { expect, test } from "../../../Task1-KIB/KIBTask1/KibPages/Fixture";
import LoginPage from "../../../Task1-KIB/KIBTask1/KibPages/LoginPage";
import ProductPage from "../../../Task1-KIB/KIBTask1/KibPages/ProductPage";
import MandatoryDeatailsPage from "../../../Task1-KIB/KIBTask1/KibPages/MandatoryDeatilsPage";

Given('I navigate to the KIB demo store', async function () {
    await this.page.goto('https://kib-connect-demo-store-4.myshopify.com/password');
});

Given('I login with valid credentials', async function () {
    // نأخذ خطوات الـ loginPage من كودك
    await this.loginPage.EnterPassword();
    await this.loginPage.ClickEnterBtn();
    await this.page.waitForTimeout(3000);
});

When('I select the test product and proceed to buy', async function () {
    // نأخذ خطوات الـ productPage من كودك
    await this.productPage.ClickOnTestProduct();
    await this.page.waitForTimeout(3000);
    await this.productPage.ClickOnBuyNow();
    await this.page.waitForTimeout(3000);
});

When('I fill the mandatory details using test data', async function () {
    // نأخذ خطوات الـ mandatoryDeatailsPage من كودك مع بيانات الـ JSON
    const user = testData.usUser;
    await this.mandatoryDeatailsPage.fillEmail(user.email);
    await this.mandatoryDeatailsPage.enterLastName(user.lastName);
    await this.mandatoryDeatailsPage.fillAddress(user.address);
    await this.mandatoryDeatailsPage.enterPhone(user.phone);
});

Then('I should complete the order successfully', async function () {
    // نأخذ الخطوة النهائية
    await this.mandatoryDeatailsPage.completeOrder();
    
    // لإضافة الصورة (Screenshot) في Cucumber عند النجاح أو الفشل
    const image = await this.page.screenshot();
    this.attach(image, 'image/png');

    await this.page.waitForTimeout(3000);
});

/////negative scenario steps////////////
When('I leave the mandatory details fields empty and click the "Complete Order" button', async function () {
    await this.mandatoryDeatailsPage.completeOrder();
    await this.page.waitForTimeout(3000);
});

Then('I should see an error message indicating that mandatory fields are required', async function () {
    // This should point to a method that checks for the visibility of the error text
    await expect(this.page.getByText('Enter an email or phone number')).toBeVisible();
    await expect(this.page.getByText('Enter a last name')).toBeVisible();
    await expect(this.page.getByText('Enter an address')).toBeVisible();
    await expect(this.page.getByText('Enter a city')).toBeVisible();
    await expect(this.page.getByText('Select a state / province')).toBeVisible();
    await expect(this.page.getByText('Enter a ZIP / postal code')).toBeVisible();
    await expect(this.page.getByText('Enter a phone number')).toBeVisible();
    }
);

