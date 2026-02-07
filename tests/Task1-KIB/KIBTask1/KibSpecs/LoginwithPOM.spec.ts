
//import { expect, Page, test } from "../Fixture/Fixture";
import { expect, test } from "../KibPages/Fixture";
import LoginPage from "../KibPages/LoginPage";
import ProductPage from "../KibPages/ProductPage";
import MandatoryDeatailsPage from "../KibPages/MandatoryDeatilsPage";
import testData from "../TestData/testData.json";

test('KIBCompleteOrder', async ({ page, loginPage, productPage, mandatoryDeatailsPage }, testinfo) => {
  // const loginPage = new LoginPage(page);
  // const productPage=new ProductPage(page);

    await page.goto('https://kib-connect-demo-store-4.myshopify.com/password');
  await loginPage.EnterPassword();
  await loginPage.ClickEnterBtn();
  await page.waitForTimeout(3000);

  //producttest page
  await productPage.ClickOnTestProduct();
  await page.waitForTimeout(3000);
  await productPage.ClickOnBuyNow();

  await page.waitForTimeout(3000);
  // 3️⃣ Fill mandatory details and complete order
  const user = testData.usUser;

  await mandatoryDeatailsPage.fillEmail(user.email);
  await mandatoryDeatailsPage.enterLastName(user.lastName);
  await mandatoryDeatailsPage.fillAddress(user.address);
  await mandatoryDeatailsPage.enterPhone(user.phone);
  await mandatoryDeatailsPage.completeOrder();
    testinfo.attach(`${testinfo.title}`, { path: 'screenshots/order-completion-msg.png' });
  // 4️⃣ Wait a bit before closing
  await page.waitForTimeout(3000);
  await page.close();


});