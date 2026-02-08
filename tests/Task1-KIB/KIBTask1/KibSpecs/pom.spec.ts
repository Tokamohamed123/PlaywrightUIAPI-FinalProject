// import { test, expect } from '@playwright/test';

// test.describe('KIBUITests', () => {
// test('OrderCompleted', async ({ page },testinfo) => {
//   await page.goto('https://kib-connect-demo-store-4.myshopify.com/password');
//   await expect(page.getByText('KIB Connect Demo Store')).toBeVisible();
//   await expect(page.getByRole('textbox', { name: 'Enter store password' })).toBeVisible();
//   await expect(page.getByRole('textbox', { name: 'Enter store password' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'Enter store password' }).dblclick();
//   await page.getByRole('textbox', { name: 'Enter store password' }).press('CapsLock');
//   await page.getByRole('textbox', { name: 'Enter store password' }).fill('T');
//   await page.getByRole('textbox', { name: 'Enter store password' }).press('CapsLock');
//   await page.getByRole('textbox', { name: 'Enter store password' }).fill('Test123');
//   await expect(page.getByRole('button', { name: 'Enter' })).toBeVisible();
//   await page.getByRole('button', { name: 'Enter' }).click();
//    await page.waitForLoadState('networkidle');
//   await expect.soft(page.getByText('Welcome to our store')).toBeVisible();
//      await page.locator("//div[@data-testid='resource-list-grid']/div[2]//div[@data-product-id='8571523137735']").dblclick();
// await page.waitForLoadState('domcontentloaded');
//   // سطر 56 المعدل:
// await expect(page.getByRole('button', { name: 'Buy it now' })).toBeVisible({ timeout: 15000 });
//   await expect(page.getByRole('heading', { name: 'Test Product' })).toBeVisible();
// await page.getByRole('button', { name: 'Buy it now' }).click();
//   await expect(page.getByRole('textbox', { name: 'Email or mobile phone number' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'Email or mobile phone number' }).dblclick();
//   await page.getByRole('textbox', { name: 'Email or mobile phone number' }).fill('test@gmail.com');
// //   await expect(page.locator('#Select1806')).toBeVisible();
//   await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'Last name' }).dblclick();
//   await page.getByRole('textbox', { name: 'Last name' }).fill('hassan');

//  await page.getByRole('combobox', { name: 'Address' }).fill('1522 Cohoe Ct, Kenai, Alaska 99611, USA');

// // 2. انتظار ظهور قائمة الاقتراحات (ضروري جداً)
// // ننتظر ظهور أي عنصر يحمل دور "option" أو "listbox"
// await page.locator('[role="option"]').first().waitFor({ state: 'visible', timeout: 5000 });

// // 3. الضغط على السهم للأسفل ثم Enter لاختيار أول نتيجة
// await page.keyboard.press('ArrowDown');
// await page.keyboard.press('Enter');

// // 2. التحقق من ظهور حقل الهاتف (بدلاً من dblclick استخدم click واحدة)
// await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('(907) 335-3331');
// await page.keyboard.press('Tab'); 

// // 2. الانتظار حتى تختفي أي علامات تحميل (Loading) أو تهدأ الشبكة
// // Shopify Checkout غالباً ما يعيد حساب الضرائب أو الشحن بعد إدخال البيانات
// await page.waitForLoadState('networkidle');

// // 3. التأكد من أن الزر "قابل للضغط" (Enabled) وليس فقط "مرئي"
// const completeOrderBtn = page.getByRole('button', { name: 'Complete order' });
// await expect(completeOrderBtn).toBeEnabled({ timeout: 10000 });
// await completeOrderBtn.click({ force: true });

// const errorBanner = page.locator('#PaymentErrorBanner, [data-test="error-banner"], .notice--error');
// await expect(errorBanner.first()).toBeVisible({ timeout: 15000 });
// await page.screenshot({ path: 'screenshots/order-completion-msg.png' });
// testinfo.attach(`${testinfo.title}`, { path: 'screenshots/order-completion-msg.png' });
// });

// test('OrderWithoutMandatoryDetails', async ({ page }) => {
//   await page.goto('https://kib-connect-demo-store-4.myshopify.com/password');
//   await expect(page.getByRole('textbox', { name: 'Enter store password' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'Enter store password' }).dblclick();
//   await page.getByRole('textbox', { name: 'Enter store password' }).press('CapsLock');
//   await page.getByRole('textbox', { name: 'Enter store password' }).fill('T');
//   await page.getByRole('textbox', { name: 'Enter store password' }).press('CapsLock');
//   await page.getByRole('textbox', { name: 'Enter store password' }).fill('Test123');
//   await expect(page.getByRole('button', { name: 'Enter' })).toBeVisible();
//   await page.getByRole('button', { name: 'Enter' }).dblclick();
//   await expect(page.locator('#product-card-ARHJPVGNQY1N2RnlDb__static-product-card-1 product-title')).toBeVisible();
//   await page.waitForTimeout(3000);
//    await page.waitForLoadState('networkidle');
//      await page.locator("//div[@data-testid='resource-list-grid']/div[2]//div[@data-product-id='8571523137735']").dblclick();
// await page.waitForLoadState('domcontentloaded');
//   await expect(page.getByRole('button', { name: 'Buy it now' })).toBeVisible();
//   await page.getByRole('button', { name: 'Buy it now' }).click();
//   await expect(page.getByRole('button', { name: 'Complete order' })).toBeVisible();
//   await page.getByRole('button', { name: 'Complete order' }).dblclick();
//   await expect(page.getByText('Enter an email or phone number')).toBeVisible();
//   await expect(page.getByText('Enter a last name')).toBeVisible();
//   await expect(page.getByText('Enter an address')).toBeVisible();
//   await expect(page.getByText('Enter a city')).toBeVisible();
  
//   // Check if state/province field is present before asserting it's visible
//   const stateProvinceLocator = page.getByText('Select a state / province');
//   const stateProvinceCount = await stateProvinceLocator.count();
  
//   if (stateProvinceCount > 0) {
//     await expect(stateProvinceLocator).toBeVisible();
//   }
  
//   await expect(page.getByText('Enter a ZIP / postal code')).toBeVisible();
//   await expect(page.getByText('Enter a phone number')).toBeVisible();
// });

// });