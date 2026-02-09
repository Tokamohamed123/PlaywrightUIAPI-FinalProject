import { APIRequestContext } from '@playwright/test';

export class UserPage {
    private request: APIRequestContext;
    private baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    async register(name: string, email: string, pass: string) {
        return await this.request.post(`${this.baseUrl}/users/register`, {
            data: { name, email, password: pass },
            failOnStatusCode: false // Prevent Playwright from throwing an error 
        });
    }

    async login(email: string, pass: string) {
        return await this.request.post(`${this.baseUrl}/users/login`, {
            data: { email, password: pass },
            failOnStatusCode: false
        });
    }

    async changePassword(token: string, oldPass: string, newPass: string) {
        return await this.request.post(`${this.baseUrl}/users/change-password`, {
            headers: { 'x-auth-token': token },
            data: { currentPassword: oldPass, newPassword: newPass },
            failOnStatusCode: false
        });
    }
}