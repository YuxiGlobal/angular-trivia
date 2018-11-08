import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule, MatInputModule } from '@angular/material';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { QuestionComponent } from './main/question/question.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [AppComponent, QuestionComponent, FormDialogComponent, DashboardComponent, MainComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDvblryd5rchVLpRaj1Gl6gD3lTQewzlro",
      authDomain: "angulartriviayuxi.firebaseapp.com",
      databaseURL: "https://angulartriviayuxi.firebaseio.com",
      projectId: "angulartriviayuxi",
      storageBucket: "angulartriviayuxi.appspot.com",
      messagingSenderId: "223543897397"
    }),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  entryComponents:[FormDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
