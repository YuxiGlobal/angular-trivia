import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, timer } from 'rxjs';
import { Question } from './question.interface';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  questions: Question[];
  currentQuestion: Question;
  countdown: number;
  answerMessage = '';
  questionIndex = 0;
  inWelcome = true;
  correctAnswersCount = 0;
  readonly QUESTION_SCORE = 3;
  readonly COUNTDOWN_INTERVAL = 1000;
  readonly TRANSITION_SECONDS = 5;
  readonly QUESTION_API = './assets/questions.json';

  @ViewChild('mainWrapper') mainContainer: ElementRef;

  constructor(private httpService: HttpClient, public snackBar: MatSnackBar) {
    this.fetchQuestions();
  }

  startApp() {
    this.inWelcome = false;
  }

  fetchQuestions() {
    this.httpService
      .get(this.QUESTION_API)
      .subscribe((questions: Question[]) => {
        this.questions = questions.sort((a, b) =>  (0.5 - Math.random()));
        this.currentQuestion = this.questions[this.questionIndex];
        this.currentQuestion.options = this.currentQuestion.options.sort((a, b) => (0.5 - Math.random())); 
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
        () => this.transitionToNextQuestion(),
      );

    if (isCorrect) {
      target.classList.add('correct');
      this.correctAnswersCount++;
      this.answerMessage = 'That\'s correct. Congratulations!! 🎇 🤗 🎆';
    } else {
      target.classList.add('wrong');
      this.answerMessage = 'Maybe next time, keep learning!!💪💪';
    }
    this.snackBar.open(this.answerMessage,'', {
      duration: this.TRANSITION_SECONDS*1000,
    });
  }

  transitionToNextQuestion() {
    this.mainContainer.nativeElement.classList.add('hide');
    setTimeout(this.loadNextQuestion, 250);
  }

  loadNextQuestion = () => {
    this.mainContainer.nativeElement.classList.remove('hide');
    this.mainContainer.nativeElement.classList.add('show');
    this.answerMessage = '';
    if (this.questionIndex < this.questions.length) {
      this.currentQuestion = this.questions[
        ++this.questionIndex
      ];
    }
  }

  get isGameOver() {
    return this.questionIndex === this.questions.length - 1;
  }

  get finalScore() {
    return this.correctAnswersCount * this.QUESTION_SCORE;
  }
}
