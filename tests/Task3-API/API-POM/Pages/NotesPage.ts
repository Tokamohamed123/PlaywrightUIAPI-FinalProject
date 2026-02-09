import { APIRequestContext } from '@playwright/test';

export class NotesPage {
    private request: APIRequestContext;
    private baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    async createNote(token: string, title: string, desc: string) {
        return await this.request.post(`${this.baseUrl}/notes`, {
            headers: { 'x-auth-token': token },
            data: { title, description: desc, category: 'Home' }
        });
    }

    async updateNote(token: any, noteId: string, updatedData: any) {
        return await this.request.put(`${this.baseUrl}/notes/${noteId}`, {
            headers: { 'x-auth-token': String(token || '') },
            data: updatedData
        });
    }

    async getNote(token: string, noteId: string) {
        return await this.request.get(`${this.baseUrl}/notes/${noteId}`, {
            headers: { 'x-auth-token': String(token || '') }
        });
    }

    async deleteNote(token: string, noteId: string) {
        return await this.request.delete(`${this.baseUrl}/notes/${noteId}`, {
            headers: { 'x-auth-token': String(token || '') }
        });
    }
}