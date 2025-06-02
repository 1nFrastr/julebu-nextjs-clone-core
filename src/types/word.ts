export interface Word {
  english: string;
  chinese: string;
  soundmark: string;
}

export interface GameState {
  currentWord: Word | null;
  isAnswerVisible: boolean;
}
