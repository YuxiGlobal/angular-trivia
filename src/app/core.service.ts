import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, timer } from 'rxjs';
import { Question } from './question.interface';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  loadedQuestions: Question[];  
  readonly QUESTION_API = './assets/questions.json';

  constructor(private httpService: HttpClient) {
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
}
