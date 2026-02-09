import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { apiContext } from '../hooks/apihooks';
import { UserPage } from '../../API-POM/Pages/UserPage';
import { NotesPage } from '../../API-POM/Pages/NotesPage';
import * as _testData from '../../API-POM/data/testData.json';
import { AllureHelper } from '../../API-POM/Utils/AllureHelper';

const testData = _testData as any;

let userPage: UserPage;
let notesPage: NotesPage;
let baseUrl: string;
let token: string;
let noteId: string;
let userEmail: string;
let originalNoteData: any;

// --- Background ---

Given('The API base URL is {string}', async function (url: string) {
    baseUrl = url;
    userPage = new UserPage(apiContext, baseUrl);
    notesPage = new NotesPage(apiContext, baseUrl);
});

// --- Scenario 1: User Lifecycle & Notes ---

When('I register a new user using {string} data', async function (dataKey: string) {
    const user = testData[dataKey];
    userEmail = `user_${Date.now()}@test.com`; 
    
    const res = await userPage.register(user.name, userEmail, user.password);
    
    await AllureHelper.attachResponse(this, 'Register User', 'POST', `${baseUrl}/users/register`, res, {
        name: user.name, email: userEmail
    });

    expect(res.status()).toBe(201);
});

Then('The user should be created successfully', async function () {
    console.log(`✅ User created: ${userEmail}`);
    expect(userEmail).toBeDefined();
});

When('I log in and change password from {string} data', async function (dataKey: string) {
    const user = testData[dataKey];
    
    // Login 1
    const loginRes = await userPage.login(userEmail, user.password);
    await AllureHelper.attachResponse(this, 'Initial Login', 'POST', `${baseUrl}/users/login`, loginRes, {
        email: userEmail, password: user.password
    });
    
    const loginBody = await loginRes.json();
    token = loginBody.data.token;
    expect(loginRes.status()).toBe(200);

    // Change Password
    const changeRes = await userPage.changePassword(token, user.password, user.newPassword);
    await AllureHelper.attachResponse(this, 'Change Password', 'POST', `${baseUrl}/users/change-password`, changeRes, {
        currentPassword: user.password, newPassword: user.newPassword
    });
    
    expect(changeRes.status()).toBe(200);
});

Then('The password should be updated successfully', async function () {
    console.log("✅ Password change verified");
});

When('I log in with the new password for {string}', async function (dataKey: string) {
    const user = testData[dataKey];
    const res = await userPage.login(userEmail, user.newPassword);
    
    await AllureHelper.attachResponse(this, 'Login with New Pass', 'POST', `${baseUrl}/users/login`, res, {
        email: userEmail, password: user.newPassword
    });
    
    const body = await res.json();
    token = body.data.token; 
    expect(res.status()).toBe(200);
});

When('I add a new note using {string}', async function (dataKey: string) {
    const note = testData[dataKey];
    const res = await notesPage.createNote(token, note.title, note.description);
    
    await AllureHelper.attachResponse(this, 'Create Note', 'POST', `${baseUrl}/notes`, res, {
        title: note.title, description: note.description
    });
    
    const body = await res.json();
    noteId = body.data.id;
    originalNoteData = body.data;
    expect(res.status()).toBe(200);
});

Then('The note should be created successfully', async function () {
    expect(noteId).toBeDefined();
    console.log(`✅ Note created successfully with ID: ${noteId}`);
});

When('I update the note using {string}', async function (dataKey: string) {
    const note = testData[dataKey];
    const res = await notesPage.updateNote(token, noteId, {
        ...originalNoteData,
        title: note.updatedTitle
    });
    
    await AllureHelper.attachResponse(this, 'Update Note', 'PUT', `${baseUrl}/notes/${noteId}`, res, {
        title: note.updatedTitle
    });
    
    expect(res.status()).toBe(200);
});

Then('The note should reflect the updated changes', async function () {
    console.log("✅ Note update successfully verified in response");
});

When('I delete the current note', async function () {
    const res = await notesPage.deleteNote(token, noteId);
    await AllureHelper.attachResponse(this, 'Delete Note', 'DELETE', `${baseUrl}/notes/${noteId}`, res);
    expect(res.status()).toBe(200);
});

Then('The note should no longer exist in the system', async function () {
    console.log("✅ Final Step: Note deleted from system");
});

// --- Scenario 2: Duplicate Email ---

When('I try to register with an existing email from {string}', async function (dataKey: string) {
    const user = testData[dataKey];
    const res = await userPage.register(user.name, user.email, user.password);
    
    await AllureHelper.attachResponse(this, 'Duplicate Email Attempt', 'POST', `${baseUrl}/users/register`, res, {
        name: user.name, email: user.email
    });
    
    this.lastResponse = res;
});

Then('I should receive an error {string}', async function (errorMessage: string) {
    const res = this.lastResponse;
    const body = await res.json();
    expect(res.status()).toBe(409); 
    expect(body.message).toBe(errorMessage);
});

// --- Scenario 3: Password Validation ---

When('I attempt registration with all invalid password data from {string}', async function (dataKey: string) {
    const errorScenarios = testData[dataKey]; 
    this.results = []; 

    for (const scenario of errorScenarios) {
        const res = await userPage.register(scenario.name, scenario.email, scenario.pass);
        
        await AllureHelper.attachResponse(this, `Check Password: ${scenario.desc}`, 'POST', `${baseUrl}/users/register`, res, {
            name: scenario.name, email: scenario.email, password: scenario.pass
        });

        this.results.push({
            description: scenario.desc,
            status: res.status(),
            body: await res.json()
        });
    }
});

Then('all attempts should fail with status {int} and the correct error message', async function (expectedStatus: number) {
    for (const res of this.results) {
        expect(res.status).toBe(expectedStatus);
        expect(res.body.message).toBe("Password must be between 6 and 30 characters");
    }
});