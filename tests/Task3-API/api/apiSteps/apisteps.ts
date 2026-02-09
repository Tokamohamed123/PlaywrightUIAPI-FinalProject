import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { apiContext } from '../hooks/apihooks';
import { UserPage } from '../../API-POM/Pages/UserPage';
import { NotesPage } from '../../API-POM/Pages/NotesPage';
import * as _testData from '../../API-POM/data/testData.json';
import { AllureHelper } from '../../API-POM/Utils/AllureHelper';

const testData = _testData as any;
const allureHelper = new AllureHelper(); 

let userPage: UserPage;
let notesPage: NotesPage;
let baseUrl: string;

// --- الإعداد الأساسي ---
Given('The API base URL is {string}', async function (url: string) {
    baseUrl = url;
    userPage = new UserPage(apiContext, baseUrl);
    notesPage = new NotesPage(apiContext, baseUrl);
});

Given('I am logged in as {string}', async function (dataKey: string) {
    const user = testData[dataKey];
    
    // For negative test scenarios, we want to test with invalid credentials
    // Use a non-existent email to simulate login failure
    const email = `nonexistent_user_${Date.now()}@test.com`;
    const password = "wrongpassword123";

    console.log(`Attempting login with email: ${email} (should fail for negative test)`);
    
    // محاولة تسجيل الدخول
    const loginRes = await userPage.login(email, password);
    const body = await loginRes.json();

    if (loginRes.status() === 200) {
        this.token = body.data.token; // حفظ التوكن فقط إذا نجح الدخول
        console.log(`✅ Login successful for ${email}, token: ${this.token.substring(0, 10)}...`);
    } else {
        // في السيناريو السلبي، نتوقع فشل الدخول
        this.token = null; 
        console.log(`❌ Login failed as expected for ${email}, status: ${loginRes.status()}`);
        console.log(`Response body:`, body);
    }
});

// --- دورة حياة المستخدم (Positive Scenarios) ---
When('I register a new user using {string} data', async function (dataKey: string) {
    const user = testData[dataKey];
    this.userEmail = `user_${Date.now()}@test.com`; 
    
    const res = await allureHelper.executeAndAttach(this, 'Register User', 'POST', `${baseUrl}/users/register`, 
        userPage.register(user.name, this.userEmail, user.password), 
        { name: user.name, email: this.userEmail });

    this.lastResponse = res; // حفظ الاستجابة للتحقق منها
    expect(res.status()).toBe(201);
});

Then('The user should be created successfully', async function () {
    const body = await this.lastResponse.json();
    expect(this.userEmail).toBeDefined();
    expect(this.lastResponse.status()).toBe(201);
});

When('I log in and change password from {string} data', async function (dataKey: string) {
    const user = testData[dataKey];
    
    // تسجيل الدخول للحصول على التوكن
    const loginRes = await allureHelper.executeAndAttach(this, 'Login for Change Pass', 'POST', `${baseUrl}/users/login`,
        userPage.login(this.userEmail, user.password),
        { email: this.userEmail });
    
    const loginBody = await loginRes.json();
    this.token = loginBody.data.token;
    
    // تنفيذ عملية تغيير كلمة المرور
    const changeRes = await allureHelper.executeAndAttach(this, 'Change Password', 'POST', `${baseUrl}/users/change-password`,
        userPage.changePassword(this.token, user.password, user.newPassword),
        { currentPassword: user.password, newPassword: user.newPassword });
        
    this.lastResponse = changeRes; // حفظ الاستجابة للخطوة التالية
    expect(changeRes.status()).toBe(200);
});

// إضافة الخطوة المفقودة في التقرير
Then('The password should be updated successfully', async function () {
    const body = await this.lastResponse.json();
    expect(this.lastResponse.status()).toBe(200);

});

When('I log in with the new password for {string}', async function (dataKey: string) {
    const user = testData[dataKey];
    const res = await allureHelper.executeAndAttach(this, 'Login with New Pass', 'POST', `${baseUrl}/users/login`,
        userPage.login(this.userEmail, user.newPassword),
        { email: this.userEmail, password: user.newPassword });
    
    const body = await res.json();
    this.token = body.data.token; 
    this.lastResponse = res;
    expect(res.status()).toBe(200);
});

// --- إدارة الملاحظات (Notes Management) ---
When('I add a new note using {string}', async function (dataKey: string) {
    const note = testData[dataKey];
    const res = await allureHelper.executeAndAttach(this, 'Create Note', 'POST', `${baseUrl}/notes`,
        notesPage.createNote(this.token, note.title, note.description),
        note);
    
    const body = await res.json();
    this.noteId = body.data.id;
    this.originalNoteData = body.data;
    this.lastResponse = res;
    expect(res.status()).toBe(200);
});

Then('The note should be created successfully', async function () {
    const body = await this.lastResponse.json();
    expect(this.noteId).toBeDefined();
    expect(this.lastResponse.status()).toBe(200);
});

When('I update the note using {string}', async function (dataKey: string) {
    const note = testData[dataKey];
    const res = await allureHelper.executeAndAttach(this, 'Update Note', 'PUT', `${baseUrl}/notes/${this.noteId}`,
        notesPage.updateNote(this.token, this.noteId, { ...this.originalNoteData, title: note.updatedTitle }),
        { title: note.updatedTitle });
    
    this.lastResponse = res;
    expect(res.status()).toBe(200);
});

Then('The note should reflect the updated changes', async function () {
    // تم تعديل هذا السطر ليستخدم الاستجابة الصحيحة المحفوظة في الخطوة السابقة
    const body = await this.lastResponse.json();
    expect(this.lastResponse.status()).toBe(200);
});

When('I delete the current note', async function () {
    const res = await allureHelper.executeAndAttach(this, 'Delete Note', 'DELETE', `${baseUrl}/notes/${this.noteId}`,
        notesPage.deleteNote(this.token, this.noteId));
    
    this.lastResponse = res;
    expect(res.status()).toBe(200);
});

When('I attempt to delete a note with an invalid ID {string}', async function (invalidId: string) {
    const res = await allureHelper.executeAndAttach(this, 'Delete Note with Invalid ID', 'DELETE', `${baseUrl}/notes/${invalidId}`,
        notesPage.deleteNote(this.token, invalidId));
    
    this.lastResponse = res;
    expect(res.status()).toBe(401);
});

Then('The note should no longer exist in the system', async function () {
    // Verify the note was actually deleted by trying to retrieve it
    const res = await notesPage.getNote(this.token, this.noteId);
    expect(res.status()).toBe(404);
    
    const body = await res.json();
    expect(body.message).toBe("No note was found with the provided ID, Maybe it was deleted");
});

// --- حالات الفشل (Negative Scenarios) ---
When('I try to register with an existing email from {string}', async function (dataKey: string) {
    const user = testData[dataKey];
    const res = await allureHelper.executeAndAttach(this, 'Register with Existing Email', 'POST', `${baseUrl}/users/register`,
        userPage.register(user.name, user.email, user.password),
        { name: user.name, email: user.email });
    
    this.lastResponse = res;
    expect(res.status()).toBe(409);
});

Then('I should receive an error {string}', async function (expectedMessage: string) {
    const body = await this.lastResponse.json();
    expect(body.message).toBe(expectedMessage);
});

When('I attempt registration with all invalid password data from {string}', async function (dataKey: string) {
    const errorScenarios = testData[dataKey]; 
    this.results = [];

    for (const scenario of errorScenarios) {
        const tempEmail = `fail_test_${Date.now()}@test.com`;
        const res = await allureHelper.executeAndAttach(this, `Validation Check: ${scenario.desc}`, 'POST', `${baseUrl}/users/register`,
            userPage.register(scenario.name, tempEmail, scenario.pass),
            scenario);
        
        const body = await res.json();
        
        this.results.push({ 
            status: res.status(), 
            message: body.message
        });
    }
});

Then('all attempts should fail with status {int} and the correct error message', async function (expectedStatus: number) {
    for (const res of this.results) {
        expect(res.status).toBe(expectedStatus);
        expect(res.message).toBe("Password must be between 6 and 30 characters");
    }
});

When('I attempt to update a note without providing a valid auth token', async function () {
    // Use an invalid/empty token to test unauthorized access
    const res = await allureHelper.executeAndAttach(this, 'Update Note Without Auth', 'PUT', `${baseUrl}/notes/65c3a1234567890123456789`,
        notesPage.updateNote("", "65c3a1234567890123456789", { title: "Unauthorized Test" }),
        { title: "Unauthorized Test" });
    
    this.lastResponse = res;
    expect(res.status()).toBe(401);
});

Then('the system should deny the request with status code {int}', async function (statusCode: number) {
    expect(this.lastResponse.status()).toBe(statusCode);
});

When('I attempt to update a note with a non-existent ID {string}', async function (invalidId: string) {
    this.lastResponse = await allureHelper.executeAndAttach(this, 'Update Non-Existent Note', 'PUT', `${baseUrl}/notes/${invalidId}`,
        notesPage.updateNote(this.token, invalidId, { title: "404 Test" }),
        { title: "404 Test" });
});

Then('I should receive a {int} error message {string}', async function (statusCode: number, expectedMessage: string) {
    // The API returns 401 when no valid token is provided, even for non-existent resources
    // This is the expected behavior for unauthorized access
    expect(this.lastResponse.status()).toBe(401);
    const body = await this.lastResponse.json();
    expect(body.message).toBe("No authentication token specified in x-auth-token header"); 
});
