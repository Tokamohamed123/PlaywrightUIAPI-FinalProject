import { Page, Locator } from '@playwright/test';

export async function smartClick(
  page: Page,
  target: Locator,
) {
  // 1️ Primary: Coordinate-based click
  try {
    const box = await target.boundingBox();
    if (box) {
      await page.mouse.click(
        box.x + box.width / 2,
        box.y + box.height / 2
      );
      return;
    }
  } catch (e) {
    console.warn('Coordinate click failed, falling back...');
  }

  // 2️ Fallback: DispatchEvent
  try {
    await target.dispatchEvent('click');
    return;
  } catch (e) {
    console.warn('DispatchEvent failed, falling back...');
  }

  // 3️ Last resort: JS fallback (Flutter semantics)
  await page.evaluate(() => {
    const semantics = document.querySelector('flt-semantics');
    if (!semantics) {
      throw new Error('No flt-semantics element found');
    }
    semantics.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
  });
}
