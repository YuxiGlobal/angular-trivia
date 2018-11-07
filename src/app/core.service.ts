import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, timer } from 'rxjs';
import { Question } from './question.interface';
import { AngularFirestore } from "@angular/fire/firestore";
@Injectable({
  providedIn: 'root'
})
export class CoreService {

  loadedQuestions: Question[];  
  readonly QUESTION_API = './assets/questions.json';

  constructor(private httpService: HttpClient, private fireStore: AngularFirestore) {
    this.fetchQuestions();
  }

  fetchQuestions() {
    this.httpService
      .get(this.QUESTION_API)
      .subscribe((questions: Question[]) => {
        this.loadedQuestions = questions;
      });
  }

  get questions():Question[] { 
    return this.loadedQuestions;
  }

  saveUserScore(username: string, score: number) {
    this.fireStore.collection('scores').add({ username, score});
  }

  loadScores():Observable<any> {
    return this.fireStore.collection('scores', ref => ref.orderBy('score','desc')).valueChanges();
  }
}
