import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, 
        type User as FirebaseUser, type UserCredential } from 'firebase/auth';
import {type User} from '../types/User';
import {auth} from './firebaseService';


const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName ?? undefined,
        photoURL: firebaseUser.photoURL ?? undefined
    };
}

export const authService = {
    getCurrentUser: (): User | null => {
        const firebaseUser = auth.currentUser;
        return firebaseUser ? mapFirebaseUserToUser(firebaseUser) : null;
    },
    signUpWithEmail:async (email: string, password: string): Promise<UserCredential> => {
        try{
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw error;
        }
    },
    loginWithEmail:async (email: string, password: string): Promise<UserCredential> => {
        try{
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw error;
        }
    },
    loginWithGoogle:async (): Promise<UserCredential> => {
        const provider = new GoogleAuthProvider();
        try{
            return await signInWithPopup(auth, provider);
        } catch (error) {
            throw error;
        }
    },
    logout:async (): Promise<void> => {
        try{
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    },
    onAuthStateChanged:(callback: (user: User | null) => void): (() => void) => {
        return onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                callback(mapFirebaseUserToUser(firebaseUser));
            } else {
                callback(null);
            }
        });
    }
};