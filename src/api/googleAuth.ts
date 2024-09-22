/* eslint-disable @typescript-eslint/no-unused-vars */

import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  sendPasswordResetEmail
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCIz6eck1J-l_dJzbMlSxu7quKVByTGC8s",
    authDomain: "chefcito-comidas.firebaseapp.com",
    projectId: "chefcito-comidas",
    storageBucket: "chefcito-comidas.appspot.com",
    messagingSenderId: "170744366068",
    appId: "1:170744366068:web:06ec928f713aaef4e6afa1",
    measurementId: "G-82VF25ZVYZ"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        await setPersistence(auth,browserLocalPersistence)
        return await signInWithPopup(auth, googleProvider);
    } catch (err) {
        console.error(err);
    }
};

const loginUserPassword = async (email:string,password:string) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        return user.user
    } catch (error:any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return null
    }
}

const createUserPassword = async (email:string,password:string) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password)
        return user.user
    } catch (error:any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return null
    }
}

const logout = () => {
    signOut(auth);
};

const isLogIn = () => {
    return auth?.currentUser !== null
}

const getUser = () => {
    return auth?.currentUser
}

const getToken  = async () => {
    return await auth?.currentUser?.getIdToken()
}

const resetpassword = async (email:string) => {
    try {
        await sendPasswordResetEmail(auth,email);
        alert('Email para recuperacion de contraseña enviado');
    }
    catch(error) {
        console.log("error ===>", error);
    }
}
export {
    auth,
    signInWithGoogle,
    logout,
    isLogIn,
    getUser,
    getToken,
    loginUserPassword,
    createUserPassword,
    resetpassword,
};