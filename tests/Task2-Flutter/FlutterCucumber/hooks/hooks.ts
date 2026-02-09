import { After, Before, AfterAll, BeforeAll, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, expect, Request, Response } from '@playwright/test';
import * as fs from 'fs';
import { allure } from 'allure-playwright';

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: false });
});

Before({ tags: "@Flutter" }, async function () {
    if (!browser) {
        browser = await chromium.launch({ headless: false });
    }
    // separate context and page for each scenario to ensure isolation
    this.context = await browser.newContext();
    this.page = await this.context.newPage();

    // create screenshots directory 
    if (!fs.existsSync('screenshots')) {
        fs.mkdirSync('screenshots');
    }
});

After({ tags: "@Flutter" }, async function (scenario) {
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
