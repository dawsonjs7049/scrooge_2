// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
// import { AngularFirestore } from '@angular/fire/compat/firestore';


import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularFireModule } from '@angular/fire/compat';


// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    AngularFireModule,
    CommonModule, 
    FormsModule,
    // NgxChartsModule, 
    BrowserAnimationsModule, 
    BrowserModule,

  ]
})


export class AuthModule { }
