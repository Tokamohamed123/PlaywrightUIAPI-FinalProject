import { After,Before,AfterAll,BeforeAll,Status,setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser,BrowserContext, expect } from '@playwright/test';
import * as fs from 'fs'; 
import LoginPage from "../../../Task1-KIB/KIBTask1/KibPages/LoginPage";
import ProductPage from "../../../Task1-KIB/KIBTask1/KibPages/ProductPage";
import MandatoryDeatailsPage from "../../../Task1-KIB/KIBTask1/KibPages/MandatoryDeatilsPage";

let browser: Browser;
let context: BrowserContext;

// Set default timeout to 30 seconds
setDefaultTimeout(30 * 1000);

BeforeAll(async function () {
    browser = await chromium.launch({ headless: false });
    
});

Before({ tags: "@KIB" },async function () {
    context = await browser.newContext();
    const page = await context.newPage();
    this.page = page;
    
    // Initialize page objects
    this.loginPage = new LoginPage(page);
    this.productPage = new ProductPage(page);
    this.mandatoryDeatailsPage = new MandatoryDeatailsPage(page);
});

After({ tags: "@KIB" },async function () {
    // Take screenshot before closing browser
    if (this.page) {
        try {
            const screenshot = await this.page.screenshot();
            this.attach(screenshot, 'image/png');
        } catch (error) {
            console.log('Screenshot failed:', error);
        }
    }
    
    await this.page?.close();
    await context?.close();
});

AfterAll(async function () {
    await browser.close();
});
