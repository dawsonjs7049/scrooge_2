import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  userData: any;
  error : string = '';

  constructor(private router: Router, private auth : Auth) {}

  onAuthStateChanged = (this.auth, (user:any) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      this.userData = user;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(this.userData));
      JSON.parse(localStorage.getItem('user')!);
      // ...
    } else {
      // User is signed out
      // ...
      this.isAuthenticated = false;
      localStorage.setItem('user', 'null');
      JSON.parse(localStorage.getItem('user')!);
    }
  });

  async login(email:string, password:string) {
    if (this.isLoading) return '';

    this.isLoading = true;

    await signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log("user cred: " + userCredential);
        localStorage.setItem('user', JSON.stringify(userCredential));
        this.isAuthenticated = true;
        this.router.navigate(['dashboard']);
      })
      .catch((error) => {
        const errorMessage = error.message;
        this.isAuthenticated = false;

        this.error = errorMessage;

      })
      .finally(() => {
        this.isLoading = false;
   
      });

      return this.error;
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);

    return user !== null;
  }

  // Sign out
  logout() {
    signOut(this.auth)
      .then(() => {
        this.isAuthenticated = false;
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        // An error happened.
      });
  }

}

// import { Injectable, NgZone } from '@angular/core';
// import { User } from '../interfaces/user';
// import * as auth from 'firebase/auth';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import {
//   AngularFirestore,
//   AngularFirestoreDocument,
// } from '@angular/fire/compat/firestore';
// import { Router } from '@angular/router';
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   userData: any; // Save logged in user data
//   isLoading : boolean = false;
//   constructor(
//     public afs: AngularFirestore, // Inject Firestore service
//     public afAuth: AngularFireAuth, // Inject Firebase auth service
//     public router: Router,
//     public ngZone: NgZone // NgZone service to remove outside scope warning
//   ) {
//     /* Saving user data in localstorage when 
//     logged in and setting up null when logged out */
//     this.afAuth.authState.subscribe((user) => {
//       if (user) {
//         this.userData = user;
//         localStorage.setItem('user', JSON.stringify(this.userData));
//         JSON.parse(localStorage.getItem('user')!);
//       } else {
//         localStorage.setItem('user', 'null');
//         JSON.parse(localStorage.getItem('user')!);
//       }
//     });
//   }
//   // Sign in with email/password
//   login(email: string, password: string) {
//     return this.afAuth
//       .signInWithEmailAndPassword(email, password)
//       .then((result) => {
//         this.ngZone.run(() => {
//           this.router.navigate(['dashboard']);
//         });
//         this.SetUserData(result.user);
//       })
//       .catch((error) => {
//         window.alert(error.message);
//       });
//   }

//   // Returns true when user is looged in and email is verified
//   get isLoggedIn(): boolean {
//     const user = JSON.parse(localStorage.getItem('user')!);
//     return user !== null;
//   }

//   // Auth logic to run auth providers
//   AuthLogin(provider: any) {
//     return this.afAuth
//       .signInWithPopup(provider)
//       .then((result) => {
//         this.ngZone.run(() => {
//           this.router.navigate(['dashboard']);
//         });
//         this.SetUserData(result.user);
//       })
//       .catch((error) => {
//         window.alert(error);
//       });
//   }
//   /* Setting up user data when sign in with username/password, 
//   sign up with username/password and sign in with social auth  
//   provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
//   SetUserData(user: any) {
//     const userRef: AngularFirestoreDocument<any> = this.afs.doc(
//       `users/${user.uid}`
//     );
//     const userData: User = {
//       uid: user.uid,
//       email: user.email,
//       name: user.name
//     };
//     return userRef.set(userData, {
//       merge: true,
//     });
//   }
//   // Sign out
//   SignOut() {
//     return this.afAuth.signOut().then(() => {
//       localStorage.removeItem('user');
//       this.router.navigate(['login']);
//     });
//   }
// }