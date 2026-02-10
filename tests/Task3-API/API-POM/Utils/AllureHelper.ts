
import { allure } from "allure-playwright";
import { APIResponse } from "@playwright/test";

export class AllureHelper {
    private context: any;

    constructor(context: any) {
        this.context = context; //  Cucumber (this)
    }

    async executeAndAttach(
        name: string, 
        method: string, 
        url: string, 
        call: Promise<APIResponse>, 
        requestData?: any
    ) {
        const startTime = Date.now();
        const res = await call;
        const duration = Date.now() - startTime;

        await this.attachResponse(name, method, url, res, duration, requestData);
        return res; 
    }

    async attachResponse(
        name: string, 
        method: string, 
        url: string, 
        res: APIResponse, 
        duration: number,
        requestData?: any
    ) {
        try {
            let responseBody;
            const text = await res.text();
            try {
                responseBody = JSON.parse(text);
            } catch {
                responseBody = text || 'No Content';
            }

            const attachmentData = {
                step: name,
                duration: `${duration}ms`,
                request: { method, url, data: requestData || {} },
                response: { status: res.status(), body: responseBody }
            };

            
            await this.context.attach(JSON.stringify(attachmentData, null, 2), 'application/json');

            // add step in allure report with details of the API call and response
            await allure.step(`${method} - ${name} [${res.status()}]`, async () => {
                await allure.attachment(`Details`, JSON.stringify(attachmentData, null, 2), 'application/json');
                allure.label('api-status', res.status().toString());
            });

            
            this.context.apiLogs = this.context.apiLogs || [];
            this.context.apiLogs.push(attachmentData);

        } catch (e) {
            console.error(`Error in AllureHelper:`, e);
        }
    }
}



// import { allure } from "allure-playwright";

// export class AllureHelper {

// async executeAndAttach(
//         context: any, 
//         name: string, 
//         method: string, 
//         url: string, 
//         call: Promise<any>, 
//         requestData?: any
//     ) {
      
//         const res = await call;
//         await this.attachResponse(context, name, method, url, res, requestData);

//         return res; 
//     }
    
//      // func to add API response as attachment in Allure and Cucumber
//     /// static func to call it without creating a new object of the class to use it directly
//      async attachResponse(context: any, name: string, method: string, url: string, res: any, requestData?: any) {
//     console.log(`🚀 Step: Attaching API response for: ${name}`); 
    
//     try {
//         let responseBody;
//         try {
//             responseBody = await res.json();
//         } catch {
//             responseBody = await res.text();
//         }

//         // allure make sure to show the arrow for the step and show details in the report (response,request,status,...)
//         const attachmentData = {
//             step: name,
//             request: { method, url, data: requestData || {} },
//             response: { status: res.status(), body: responseBody }
//         };

//         /// to enforce the allure report to show arrow for the steps and show details(respone,request,status,...)
//         await context.attach(JSON.stringify(attachmentData, null, 2), 'application/json');

//         // to org the attachments in allure report and show details in a clear way
//         await allure.step(`${name} - API Details`, async () => {
//             await allure.attachment(`Response Body`, JSON.stringify(responseBody, null, 2), 'application/json');
//             allure.label('api-status', res.status().toString());
//         });

//         console.log(`Successfully attached ${name}`);
//     } catch (e) {
//         console.error(`Failed to attach ${name}:`, e);
//     }
// }

// }

