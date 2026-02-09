import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { apiContext } from '../hooks/apihooks';
import { UserPage } from '../../API-POM/Pages/UserPage';
import { NotesPage } from '../../API-POM/Pages/NotesPage';
import { allure } from 'allure-playwright';
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


Given('The API base URL is {string}', async function (url: string) {
    baseUrl = url;
    userPage = new UserPage(apiContext, baseUrl);
    notesPage = new NotesPage(apiContext, baseUrl);
});



When('I register a new user using {string} data', async function (dataKey: string) {
    const user = testData[dataKey];
    userEmail = `user_${Date.now()}@test.com`; 
    
    const res = await userPage.register(user.name, userEmail, user.password);
    
    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports 
    await AllureHelper.attachResponse(this, 'Register User', 'POST', `${baseUrl}/users/register`, res, {
        name: user.name, email: userEmail
    });

    expect(res.status()).toBe(201);
});

Then('The user should be created successfully', async function () {
    console.log(`✅ User created: ${userEmail}`);
});

When('I log in and change password from {string} data', async function (dataKey: string) {
    const user = testData[dataKey];
    
    const loginRes = await userPage.login(userEmail, user.password);

    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports
    await AllureHelper.attachResponse(this, 'Initial Login', 'POST', `${baseUrl}/users/login`, loginRes, {
        email: userEmail, password: user.password
    });
    
    const loginBody = await loginRes.json();
    token = loginBody.data.token;
    expect(loginRes.status()).toBe(200);

    const changeRes = await userPage.changePassword(token, user.password, user.newPassword);
    
    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports
    await AllureHelper.attachResponse(this, 'Change Password', 'POST', `${baseUrl}/users/change-password`, changeRes, {
        currentPassword: user.password, newPassword: user.newPassword
    });
    
    expect(changeRes.status()).toBe(200);
});

When('I log in with the new password for {string}', async function (dataKey: string) {
    const user = testData[dataKey];
    const res = await userPage.login(userEmail, user.newPassword);
    
    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports
    await AllureHelper.attachResponse(this, 'Login with New Pass', 'POST', `${baseUrl}/users/login`, res, {
        email: userEmail, password: user.newPassword
    });
    
    const body = await res.json();
    token = body.data.token; 
    expect(res.status()).toBe(200);
});

/// add a new note 

When('I add a new note using {string}', async function (dataKey: string) {
    const note = testData[dataKey];
    const res = await notesPage.createNote(token, note.title, note.description);
    
    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports
    await AllureHelper.attachResponse(this, 'Create Note', 'POST', `${baseUrl}/notes`, res, {
        title: note.title, description: note.description
    });
    
    const body = await res.json();
    noteId = body.data.id;
    originalNoteData = body.data;
    expect(res.status()).toBe(200);
});

When('I update the note using {string}', async function (dataKey: string) {
    const note = testData[dataKey];
    const res = await notesPage.updateNote(token, noteId, {
        ...originalNoteData,
        title: note.updatedTitle
    });
    
    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports
    await AllureHelper.attachResponse(this, 'Update Note', 'PUT', `${baseUrl}/notes/${noteId}`, res, {
        title: note.updatedTitle
    });
    
    expect(res.status()).toBe(200);
});

When('I delete the current note', async function () {
    const res = await notesPage.deleteNote(token, noteId);

    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports
    await AllureHelper.attachResponse(this, 'Delete Note', 'DELETE', `${baseUrl}/notes/${noteId}`, res);
    expect(res.status()).toBe(200);
});

/////////////// negative scenario (Duplicate Email) ////////////////

When('I try to register with an existing email from {string}', async function (dataKey: string) {
    const user = testData[dataKey];
    const res = await userPage.register(user.name, user.email, user.password);
    
    // attachApiResponse(this) to record the API response and request details in Allure and Cucumber reports
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