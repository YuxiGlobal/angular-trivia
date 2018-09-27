import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, timer } from 'rxjs';
import { Question } from './question.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  questions: Question[];
  currentQuestion: Question;
  countdown: number;
  answerMessage = '';
  questionIndex = 0;
  correctAnswersCount = 0;
  readonly QUESTION_SCORE = 3;
  readonly COUNTDOWN_INTERVAL = 1000;
  readonly TRANSITION_SECONDS = 5;
  readonly QUESTION_API = './assets/questions.json';

  constructor(private httpService: HttpClient) {
    this.fetchQuestions();
  }

  fetchQuestions() {
    this.httpService
      .get(this.QUESTION_API)
      .subscribe((questions: Question[]) => {
        this.questions = questions;
        this.currentQuestion = this.questions[this.questionIndex];
      });
  }

  checkAnswer(target: HTMLElement, isCorrect: boolean) {
    target =
      target.nodeName === 'SPAN' ? target.parentElement : target;

    this.countdown = this.TRANSITION_SECONDS;
    interval(this.COUNTDOWN_INTERVAL)
      .pipe(take(this.TRANSITION_SECONDS))
      .subscribe(
        () => {
          this.countdown--;
        },
        null, // Error callback
        () => {
          this.answerMessage = '';
          if (this.questionIndex < this.questions.length) {
            this.currentQuestion = this.questions[
              ++this.questionIndex
            ];
          }
        },
      );

    console.log(target);

    if (isCorrect) {
      target.style.backgroundColor = 'green';
      this.correctAnswersCount++;
      this.answerMessage = 'Congratulations!!';
    } else {
      target.style.backgroundColor = 'red';
      this.answerMessage = 'Wrong aswer';
    }
  }

  get isGameOver() {
    return this.questionIndex === this.questions.length - 1;
  }

  get finalScore() {
    return this.correctAnswersCount * this.QUESTION_SCORE;
  }
}
