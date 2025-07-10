// app/appwrite/auth.ts
import { Client, Account, ID } from 'appwrite';

class AuthService {
    private client: Client;
    private account: Account;

  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

        this.account = new Account(this.client);
    }
   
   // Sign Up, Sign In, Logout, and Check User methods
    async signUp(email: string, password: string, name: string) {
        try {
            return await this.account.create(ID.unique(), email, password, name);
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
            await this.account.deleteSessions();
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
