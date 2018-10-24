import { Component, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from "./core.service";
import { HttpClient } from '@angular/common/http';
import { interval, Observable, timer, Subject } from 'rxjs';
import { Question } from './question.interface';
import { take, takeUntil } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

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
  snackbarOptions: MatSnackBarConfig;
  skipToNext$: Subject<any>;
  readonly COUNTDOWN_INTERVAL = 1000;
  readonly TRANSITION_SECONDS = 500;


  @ViewChild('mainWrapper') mainContainer: ElementRef;

  constructor(public snackBar: MatSnackBar, private coreService: CoreService) {
    this.skipToNext$ = new Subject();
  }

  
  startApp(): void {
    this.inWelcome = false;
    this.loadQuestions();
    this.setSnackBarConfig();
  }

  setSnackBarConfig(): void {
    this.snackbarOptions = new MatSnackBarConfig();
    this.snackbarOptions.verticalPosition = 'top';
    this.snackbarOptions.horizontalPosition = 'right';
    this.snackbarOptions.duration = this.TRANSITION_SECONDS * 1000;
    this.snackbarOptions.panelClass = '';
  }

  loadQuestions(): void {
    this.questions = this.coreService.questions.sort((a, b) => (0.5 - Math.random()));
    this.currentQuestion = this.questions[this.questionIndex];
    this.currentQuestion.options = this.currentQuestion.options.sort((a, b) => (0.5 - Math.random()));
  }

  checkAnswer(isCorrect: boolean): void {
    this.countdown = this.TRANSITION_SECONDS;
    interval(this.COUNTDOWN_INTERVAL)
      .pipe(
        take(this.TRANSITION_SECONDS),
        takeUntil(this.skipToNext$)
      ).subscribe(
        () => {
          this.countdown--;
        },
        null, // Error callback
        () => this.transitionToNextQuestion(),
    );

    if (isCorrect) {
      this.correctAnswersCount++;
      this.snackbarOptions.panelClass = 'correct';
      this.answerMessage = 'That\'s correct. Congratulations!!  🤗🎆';
    } else {
      this.snackbarOptions.panelClass = 'wrong';
      this.answerMessage = 'Maybe next time, keep learning!! 💪💪';
    }
    this.snackBar.open(this.answerMessage, '', this.snackbarOptions);
  }

  transitionToNextQuestion(): void {
    this.snackBar.dismiss();
    this.mainContainer.nativeElement.classList.add('hide');
    setTimeout(this.loadNextQuestion, 250); // timeout applied to sync with CSS animation
  }

  loadNextQuestion = ():void => {
    this.mainContainer.nativeElement.classList.remove('hide');
    this.mainContainer.nativeElement.classList.add('show');
    this.answerMessage = '';
    if (this.questionIndex < this.questions.length) {
      this.currentQuestion = this.questions[
        ++this.questionIndex
      ];
    } else {
      ++this.questionIndex;
    }
  }

  skipToNextQuestion():void {
    this.skipToNext$.next();
  }

  resetApp():void {
    this.correctAnswersCount = 0;
    this.questionIndex = 0;
    this.loadQuestions();
    this.inWelcome = true;
  }

  get isGameOver(): boolean {
    return this.questionIndex === this.questions.length;
  }

  get finalScore(): number {
    return this.correctAnswersCount;
  }
}
