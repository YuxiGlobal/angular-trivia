import { Question } from './../../models/question.interface';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {

  @Input() currentQuestion: Question;
  @Input() disabled: boolean;
  @Output() answer: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  answerSelected(target: HTMLElement, isCorrect: boolean): void {
    this.answer.emit(isCorrect);
    target = target.nodeName === 'SPAN' ? target.parentElement : target;
    if (isCorrect) {
      target.classList.add('correct');
    } else {
      target.classList.add('wrong');
    }
  }

}
