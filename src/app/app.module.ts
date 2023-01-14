import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RecurringComponent } from './recurring/recurring.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MonthlyComponent } from './monthly/monthly.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { GoalsComponent } from './goals/goals.component';
import { RemindersComponent } from './reminders/reminders.component';
import { ViewExpensnesComponent } from './view-expensnes/view-expensnes.component';

import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RecurringComponent,
    MonthlyComponent,
    WishlistComponent,
    GoalsComponent,
    RemindersComponent,
    ViewExpensnesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule, 
    BrowserModule,
    ReactiveFormsModule,
    NgxChartsModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
