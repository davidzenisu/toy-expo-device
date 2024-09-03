import DICTIONARY, { DictionaryRecord } from "@/assets/data/dictionary";
import { randomEntry, randomList } from "./random";

// Interface for a game
export interface Game<T> {
    participants: T[];
}

export interface GameMember<T> {
    member: T;
    score: number;
}

export interface GameOptions {
    difficulty: number;
}

// Generate a method to pick a random word from the dictionary
export function createWordGame(options: GameOptions): void {
    const winningWord = randomEntry(DICTIONARY) || { word: 'random' };
    const hints = randomList([...winningWord.word], options.difficulty);
    // create a game with the winning word and hints
}

export function collectWordMembers(words: DictionaryRecord[], maxDifficulty: number) {
    const members = new Array<GameMember<DictionaryRecord>>();
    for (let i = 0; i < maxDifficulty; i++) {
        const word = randomEntry(words);
        if (word) {
            // create a game with the word
        }
    }
}