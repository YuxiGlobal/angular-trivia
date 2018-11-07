import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { QuestionComponent } from './question/question.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@NgModule({
  declarations: [AppComponent, QuestionComponent, FormDialogComponent],
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
    AngularFirestoreModule
  ],
  entryComponents:[FormDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
