import { After, Before, AfterAll, BeforeAll, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, expect, Request, Response } from '@playwright/test';
import * as fs from 'fs';
import { allure } from 'allure-playwright';

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
   browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized'] 
    });
});

Before({ tags: "@flutter" }, async function () {
    this.context = await browser.newContext({
        viewport: null //full screen
    });
    this.page = await this.context.newPage();

    // check if screenshots directory exists, if not create it 
    if (!fs.existsSync('screenshots')) {
        fs.mkdirSync('screenshots', { recursive: true });
    }
});

After({ tags: "@flutter" }, async function (scenario) {
    // take screenshot on failure
    if (scenario.result?.status === Status.FAILED) {
        const path = `screenshots/failed-${scenario.pickle.name}.png`;
        await this.page.screenshot({ path: path });

        // attach screenshot to allure report
        if (fs.existsSync(path)) {
            await allure.attachment('Failed Screenshot', fs.readFileSync(path), 'image/png');
        }
    }
    await this.page?.close();
    await this.context?.close();
});


AfterAll(async function () {
    await browser.close();
});
