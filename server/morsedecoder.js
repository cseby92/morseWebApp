'use strict'

const table = require('./morse-code-table')

const WORD_SEPARATOR = '   ';
const CHARACTER_SEPARATOR = ' ';
const SERVICE_CODES = { '...---...': 'SOS' };


class MorseDecoder {
    constructor(message) {
        this._message = message || '';
    }

    static create(message) {
        return new MorseDecoder(message);
    }

    execute() {
        return CodeRepository.fromExpression(this._message).decodeWords().getWords().join(' ');
    }
}

class CodeRepository {

    constructor(words = []) {
        this._words = words;
    }

    getWords() {
        return this._words;
    }

    static fromExpression(message) {
        let words = message.split(WORD_SEPARATOR);
        return new CodeRepository(words);
    }

    decodeWords() {

        let decodedWords = [];
        this._words.forEach((word) => {

            decodedWords.push(this.generateWord(word));
        });

        return new CodeRepository(decodedWords);
    }

    generateWord(word) {
        let letters = word.split(CHARACTER_SEPARATOR);
        return letters.map((char) => this.decodeCharacter(char)).join(''); //catch exception
    }

    decodeCharacter(char) {
        if (char === "")
            return "";

        for (let code in SERVICE_CODES) {
            if (code === char) {
                return SERVICE_CODES[code];
            }
        }
        for (let code in table) {
            if (code === char) {
                return table[code];
            }
        }
        throw new Error("Illegal morse character");

    }
}

module.exports = MorseDecoder;