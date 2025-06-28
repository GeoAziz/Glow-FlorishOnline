
import { Auth, getAuth } from 'firebase-admin/auth';
import { adminDb } from './admin';

class ServerAuth {
    private auth: Auth;
    
    constructor() {
        this.auth = getAuth();
    }
    
    async getCurrentUser() {
        // This is a placeholder. In a real app, you would get the
        // session cookie from the request headers and verify it.
        // For this environment, we'll simulate getting the first admin user
        // or a specific user for testing purposes.
        try {
            // In a real app: const decodedToken = await this.auth.verifySessionCookie(sessionCookie);
            // const user = await this.auth.getUser(decodedToken.uid);
            
            // For now, let's try to get a user. If none, return null.
            const userRecords = await this.auth.listUsers(1);
            if(userRecords.users.length > 0) {
                 const user = userRecords.users[0];
                 const userDoc = await adminDb.collection('users').doc(user.uid).get();
                 if (userDoc.exists) {
                     return { ...user, ...userDoc.data() };
                 }
                 return user;
            }
            return null;

        } catch (error) {
            console.log("No authenticated user found on server", error);
            return null;
        }
    }
}


export const auth = new ServerAuth();
