import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { request, APIRequestContext, APIResponse } from '@playwright/test';
import { allure } from 'allure-playwright';
import * as fs from 'fs';
import * as path from 'path';


setDefaultTimeout(30000);

export let apiContext: APIRequestContext;

// Enhanced response body reporting function for automatic attachment
async function autoAttachApiResponse(
    stepName: string, 
    method: string, 
    url: string, 
    response: APIResponse, 
    requestData?: any,
    context?: any
) {
    try {
        // Safely parse response body
        let responseBody;
        try {
            responseBody = await response.json();
        } catch (parseError) {
            // If response is not JSON, try to get text content
            try {
                responseBody = await response.text();
            } catch (textError) {
                responseBody = { error: 'Could not parse response body' };
            }
        }
        
        const responseHeaders = response.headers();
        
        // Create detailed response summary
        const responseSummary = {
            step: stepName,
            method: method,
            url: url,
            status: response.status(),
            statusText: response.statusText(),
            headers: responseHeaders,
            body: responseBody,
            timestamp: new Date().toISOString(),
            size: typeof responseBody === 'string' ? responseBody.length : JSON.stringify(responseBody).length,
            contentType: responseHeaders['content-type'] || 'application/json'
        };
        
        // Store in test context for comprehensive reporting
        if (context) {
            if (!context.apiResponses) context.apiResponses = [];
            context.apiResponses.push(responseSummary);
        }
        
        // Create formatted response body for better readability
        let formattedResponseBody;
        if (typeof responseBody === 'string') {
            formattedResponseBody = responseBody;
        } else {
            formattedResponseBody = JSON.stringify(responseBody, null, 2);
        }
        
        // Add to Allure report with enhanced formatting
        await allure.step(`${stepName} - API Response`, async () => {
            // Add request details
            await allure.attachment(`${stepName} - Request Details`, JSON.stringify({
                method: method,
                url: url,
                headers: requestData?.headers || {},
                body: requestData?.data || {},
                timestamp: new Date().toISOString()
            }, null, 2), 'application/json');
            
            // Add response summary
            await allure.attachment(`${stepName} - Response Summary`, JSON.stringify({
                status: response.status(),
                statusText: response.statusText(),
                contentType: responseHeaders['content-type'],
                size: responseSummary.size,
                timestamp: responseSummary.timestamp
            }, null, 2), 'application/json');
            
            // Add full response body
            await allure.attachment(`${stepName} - Response Body`, formattedResponseBody, 'application/json');
            
            // Add response headers
            await allure.attachment(`${stepName} - Response Headers`, JSON.stringify(responseHeaders, null, 2), 'application/json');
            
            // Add response status as a label for better filtering
            allure.label('api-status', response.status().toString());
            allure.label('api-method', method);
            allure.label('api-endpoint', url.split('/').pop() || 'unknown');
            
            // Add step name as a label
            allure.label('api-step', stepName.replace(/\s+/g, '-').toLowerCase());
        });
        
        return responseBody;
    } catch (error) {
        console.log(`Could not process response for ${method} ${url}:`, error);
        return null;
    }
}

// Direct attachment function for immediate use
async function attachApiResponseDirect(
    stepName: string, 
    method: string, 
    url: string, 
    response: APIResponse, 
    requestData?: any
) {
    try {
        // Safely parse response body
        let responseBody;
        try {
            responseBody = await response.json();
        } catch (parseError) {
            // If response is not JSON, try to get text content
            try {
                responseBody = await response.text();
            } catch (textError) {
                responseBody = { error: 'Could not parse response body' };
            }
        }
        
        const responseHeaders = response.headers();
        
        // Create formatted response body for better readability
        let formattedResponseBody;
        if (typeof responseBody === 'string') {
            formattedResponseBody = responseBody;
        } else {
            formattedResponseBody = JSON.stringify(responseBody, null, 2);
        }
        
        // Add to Allure report with enhanced formatting
        await allure.step(`${stepName} - API Response`, async () => {
            // Add request details
            await allure.attachment(`${stepName} - Request Details`, JSON.stringify({
                method: method,
                url: url,
                headers: requestData?.headers || {},
                body: requestData?.data || {},
                timestamp: new Date().toISOString()
            }, null, 2), 'application/json');
            
            // Add response summary
            await allure.attachment(`${stepName} - Response Summary`, JSON.stringify({
                status: response.status(),
                statusText: response.statusText(),
                contentType: responseHeaders['content-type'],
                size: typeof responseBody === 'string' ? responseBody.length : JSON.stringify(responseBody).length,
                timestamp: new Date().toISOString()
            }, null, 2), 'application/json');
            
            // Add full response body
            await allure.attachment(`${stepName} - Response Body`, formattedResponseBody, 'application/json');
            
            // Add response headers
            await allure.attachment(`${stepName} - Response Headers`, JSON.stringify(responseHeaders, null, 2), 'application/json');
            
            // Add response status as a label for better filtering
            allure.label('api-status', response.status().toString());
            allure.label('api-method', method);
            allure.label('api-endpoint', url.split('/').pop() || 'unknown');
            
            // Add step name as a label
            allure.label('api-step', stepName.replace(/\s+/g, '-').toLowerCase());
        });
        
        return responseBody;
    } catch (error) {
        console.log(`Could not process response for ${method} ${url}:`, error);
        return null;
    }
}

Before(async function () {
   
    apiContext = await request.newContext();
    
    // Track all requests and responses for detailed reporting
    const requestLog: Array<{
        method: string;
        url: string;
        headers: any;
        data?: any;
        timestamp: string;
    }> = [];
    
    const responseLog: Array<{
        method: string;
        url: string;
        status: number;
        headers: any;
        body: any;
        timestamp: string;
    }> = [];
    
    // Store logs in the test context for access in After hook
    (this as any).requestLog = requestLog;
    (this as any).responseLog = responseLog;
    
    // Store the auto-attach function in context for use in step definitions
    (this as any).autoAttachApiResponse = autoAttachApiResponse;
});

After(async function () {
    // Capture detailed request/response information for the report
    try {
        const requestLog = (this as any).requestLog || [];
        const responseLog = (this as any).responseLog || [];
        const apiResponses = (this as any).apiResponses || [];
        
        // Create comprehensive API summary
        const apiSummary = {
            totalRequests: apiResponses.length,
            successfulRequests: apiResponses.filter((r: any) => r.status >= 200 && r.status < 300).length,
            failedRequests: apiResponses.filter((r: any) => r.status >= 400).length,
            warningRequests: apiResponses.filter((r: any) => r.status >= 300 && r.status < 400).length,
            requestsByMethod: {
                GET: apiResponses.filter((r: any) => r.method === 'GET').length,
                POST: apiResponses.filter((r: any) => r.method === 'POST').length,
                PUT: apiResponses.filter((r: any) => r.method === 'PUT').length,
                DELETE: apiResponses.filter((r: any) => r.method === 'DELETE').length
            },
            requestsByEndpoint: apiResponses.reduce((acc: any, r: any) => {
                const endpoint = r.url.split('/').pop() || 'unknown';
                acc[endpoint] = (acc[endpoint] || 0) + 1;
                return acc;
            }, {}),
            responseTimes: apiResponses.map((r: any) => ({
                step: r.step,
                method: r.method,
                endpoint: r.url.split('/').pop(),
                status: r.status,
                size: r.size,
                timestamp: r.timestamp
            })),
            detailedResponses: apiResponses
        };
        
        // Add comprehensive API summary to Allure report
        await allure.step('API Test Summary', async () => {
            await allure.attachment('API Summary Statistics', JSON.stringify(apiSummary, null, 2), 'application/json');
            
            if (apiResponses.length > 0) {
                await allure.attachment('All API Responses', JSON.stringify(apiResponses, null, 2), 'application/json');
            }
            
            // Add summary as labels for better filtering in Allure
            allure.label('api-total-requests', apiSummary.totalRequests.toString());
            allure.label('api-successful-requests', apiSummary.successfulRequests.toString());
            allure.label('api-failed-requests', apiSummary.failedRequests.toString());
        });
        
        // Log summary to console
        console.log(`\n📊 API Test Summary:`);
        console.log(`   Total Requests: ${apiSummary.totalRequests}`);
        console.log(`   Successful: ${apiSummary.successfulRequests}`);
        console.log(`   Failed: ${apiSummary.failedRequests}`);
        console.log(`   Methods: ${JSON.stringify(apiSummary.requestsByMethod)}`);
        
        // Display response bodies on console
        console.log(`\n📋 Response Bodies:`);
        apiResponses.forEach((response: any, index: number) => {
            console.log(`\n--- Request ${index + 1}: ${response.step} ---`);
            console.log(`Method: ${response.method} | URL: ${response.url}`);
            console.log(`Status: ${response.status} | Size: ${response.size} bytes`);
            console.log(`Response Body:`);
            if (typeof response.body === 'string') {
                console.log(response.body);
            } else {
                console.log(JSON.stringify(response.body, null, 2));
            }
            console.log(`--- End Request ${index + 1} ---`);
        });
        
        // Save API responses to a JSON file for Allure reporting
        const allureResultsDir = path.join(process.cwd(), 'allure-results');
        try {
            if (!fs.existsSync(allureResultsDir)) {
                fs.mkdirSync(allureResultsDir, { recursive: true });
            }
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const apiReportFile = path.join(allureResultsDir, `api-responses-${timestamp}.json`);
            
            const fullReport = {
                scenario: this.pickle?.name || 'Unknown Scenario',
                timestamp: new Date().toISOString(),
                summary: apiSummary,
                responses: apiResponses
            };
            
            fs.writeFileSync(apiReportFile, JSON.stringify(fullReport, null, 2));
            console.log(`\n📁 API report saved to: ${apiReportFile}`);
        } catch (error) {
            console.log('Could not save API report file:', error);
        }
        
    } catch (error) {
        console.log('Could not capture API details:', error);
    }
    
    // إغلاق الـ Context بعد انتهاء السيناريو
    if (apiContext) {
        await apiContext.dispose();
    }
});
