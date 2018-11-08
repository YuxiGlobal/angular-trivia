import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CoreService } from '../services/core.service';
import { FormDialogComponent } from './../form-dialog/form-dialog.component';
import { Question } from './../models/question.interface';
import { interval, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  questions: Question[];
  currentQuestion: Question;
  countdown: number;
  answerMessage = '';
  questionIndex = 0;
  inWelcome = true;
  correctAnswersCount = 0;
  questionScore: number;
  totalScore = 0;
  snackbarOptions: MatSnackBarConfig;
  skipToNext$: Subject<any>;
  answerSelected$: Subject<any>;
  readonly COUNTDOWN_INTERVAL = 1000;
  readonly TRANSITION_SECONDS = 5;
  readonly MAX_POINTS_PER_QUESTION = 10000;
  readonly PENALIZATION_POINTS = 5;
  readonly TIME_PENALIZATION_INTERVAL = 20;
  readonly MINIMUM_QUESTION_SCORE = 30;
  @ViewChild('mainWrapper') mainContainer: ElementRef;

  constructor(public snackBar: MatSnackBar, private coreService: CoreService, public dialog: MatDialog, private router:Router) {
    this.skipToNext$ = new Subject();
    this.answerSelected$ = new Subject();
  }

  ngOnInit(): void {
    this.resetApp();
  }

  startApp(): void {
    this.inWelcome = false;
    this.setSnackBarConfig();
    this.loadQuestions();
  }

  setSnackBarConfig(): void {
    this.snackbarOptions = new MatSnackBarConfig();
    this.snackbarOptions.verticalPosition = 'top';
    this.snackbarOptions.horizontalPosition = 'right';
    this.snackbarOptions.duration = this.TRANSITION_SECONDS * 1000;
    this.snackbarOptions.panelClass = '';
  }

  loadQuestions(): void {
    this.questions = this.coreService.questions.sort((a, b) => (0.5 - Math.random())).slice(0, 10);
    this.currentQuestion = this.questions[this.questionIndex];
    this.currentQuestion.options = this.currentQuestion.options.sort((a, b) => (0.5 - Math.random()));
    this.resetScore();
  }

  checkAnswer(isCorrect: boolean): void {
    this.answerSelected$.next();
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
      this.totalScore += this.questionScore;
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

  loadNextQuestion = (): void => {
    this.mainContainer.nativeElement.classList.remove('hide');
    this.mainContainer.nativeElement.classList.add('show');
    this.answerMessage = '';
    if (this.questionIndex < this.questions.length) {
      this.currentQuestion = this.questions[
        ++this.questionIndex
      ];
      if (typeof (this.currentQuestion) !== 'undefined') {
        this.resetScore();
        this.currentQuestion.options = this.currentQuestion.options.sort((a, b) => (0.5 - Math.random()));
      } else {
        this.coreService.userHasPlayed = true;
      }
    } else {
      this.coreService.userHasPlayed = true;
      ++this.questionIndex;
    }
  }
  
  resetScore(): void {
    this.questionScore = this.MAX_POINTS_PER_QUESTION;
    interval(this.TIME_PENALIZATION_INTERVAL).
    pipe(
      takeUntil(this.answerSelected$)
      ).subscribe(() => {
        if (this.questionScore > this.MINIMUM_QUESTION_SCORE) {
          this.questionScore -= this.PENALIZATION_POINTS;
        } else if (this.questionScore !== this.MINIMUM_QUESTION_SCORE) {
          this.questionScore = this.MINIMUM_QUESTION_SCORE;
        }
        
      });
    }
    
    skipToNextQuestion(): void {
      this.skipToNext$.next();
    }
    
    resetApp(): void {
      this.correctAnswersCount = 0;
      this.totalScore = 0;
      this.questionIndex = 0;
      this.inWelcome = true;
      this.coreService.userHasPlayed = false;
    }

  get showQuestion(): boolean {
    return this.currentQuestion && !this.isGameOver && !this.inWelcome
  }

  get isGameOver(): boolean {
    return this.questionIndex === this.questions.length;
  }

  saveUserScore() {
    this.dialog.open(FormDialogComponent, {
      data: {
        score: this.totalScore
      }
    });
    this.dialog.afterAllClosed.subscribe(() => { this.goToLeaderboard() });
  }

  goToLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }
}
