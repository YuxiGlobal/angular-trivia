export interface Option {
  answer: string;
  isCorrect: boolean;
}

export interface Question {
  question: string;
  level: string;
  options: Option[];
}
