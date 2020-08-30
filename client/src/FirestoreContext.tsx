import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "./config/firebase";

firebase.initializeApp(firebaseConfig);
export type IFireCtx = {
    auth: firebase.auth.Auth;
    firestore: firebase.firestore.Firestore;
    providers: {
        google: firebase.auth.GoogleAuthProvider;
        // facebook: firebase.auth.FacebookAuthProvider;
    };
    getUserData: () => Partial<firebase.User> | null;
};

const auth = firebase.auth();
const firestore = firebase.firestore();

const initialContext: IFireCtx = {
    auth,
    firestore,
    providers: {
        google: new firebase.auth.GoogleAuthProvider(),
        // facebook: new firebase.auth.FacebookAuthProvider(),
    },
    getUserData: () =>
        auth.currentUser
            ? {
                  uid: auth.currentUser.uid,
                  photoURL: auth.currentUser.photoURL,
                  displayName: auth.currentUser.displayName,
                  email: auth.currentUser.email,
              }
            : null,
};

export const FireCtx = React.createContext<IFireCtx>(initialContext);

const FirestoreContext: React.FC = ({ children }): React.ReactElement => {
    return (
        <FireCtx.Provider value={initialContext}>{children}</FireCtx.Provider>
    );
};

export default FirestoreContext;
