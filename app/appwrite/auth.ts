import { Client, Account } from 'appwrite';
import { useId } from 'react';

class AuthService {
    id = useId();
    private client: Client;
    private account: Account;

    constructor() {
        this.client = new Client();
        this.client
            .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT!) // Your Appwrite endpoint
            .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!); // Your Appwrite project ID

        this.account = new Account(this.client);
    }
   
   // Sign Up, Sign In, Logout, and Check User methods
    async signUp(email: string, password: string, name: string) {
        try {
            return await this.account.create(this.id, email, password, name);
        } catch (error) {
            console.error('Sign Up Error:', error);
            throw error;
        }
    }
    async signIn(email: string, password: string) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error('Sign In Error:', error);
            throw error;
        }
    }
    async logout() {
        try {
            await this.account.deleteSession('current');
        } catch (error) {
            console.error('Logout Error:', error);
            throw error;
        }
    }
    async checkUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.error('Check User Error:', error);
            throw error;
        }
    }

}

const authservice = new AuthService();
export default authservice;