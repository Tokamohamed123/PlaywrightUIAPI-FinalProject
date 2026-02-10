// 

// hooks.ts
import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { request, APIRequestContext } from '@playwright/test';
import { AllureHelper } from '../../API-POM/Utils/AllureHelper';

setDefaultTimeout(30000);

export let apiContext: APIRequestContext;

Before(async function () {
// to create a new API context for each scenario to ensure isolation and prevent state leakage between tests
    apiContext = await request.newContext();
//create a new context of AllureHelper for each scenario to handle attachments and step logging
    this.apiHelper = new AllureHelper(this);
    
    // Initialize an array to store API logs for the current scenario on console output
    this.apiLogs = [];
});

After(async function (scenario) {
   
    if (this.apiLogs && this.apiLogs.length > 0) {
        console.log(`\n🏁 API Summary for Scenario: ${scenario.pickle.name}`);
        console.table(this.apiLogs.map((log: any) => ({
            Step: log.step,
            Method: log.request.method,
            Status: log.response.status,
            Duration: log.duration
        })));
    }

    // Dispose of the API context after each scenario to free up resources and ensure clean state for the next test
    if (apiContext) {
        await apiContext.dispose();
    }
});