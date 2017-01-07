'use strict'

const expect = require('chai').expect;
const decoder = require('./morsedecoder');

describe('MorseDecoder', function () {

    let decode = (morseCode) => decoder.create(morseCode).execute();
    
    describe('#execute', () => {
        it('should return empty string for empty input', () => {
            expect(decode('')).to.eql('');
        });

        it('should return the decoded character for one character input', () => {
            expect(decode('.-')).to.eql('A');
            expect(decode('-...')).to.eql('B');

        });

        it('should return the decoded word for one word input', () => {
            
            expect(decode('.- -...')).to.eql('AB');
            expect(decode('--.- .-- . .-.')).to.eql('QWER');

        });

        it('should return the decoded sentence for one sentence input', () => {
            
            expect(decode('.- -...   --.- .-- . .-.')).to.eql('AB QWER');
            expect(decode('.... . -.--   .--- ..- -.. .')).to.eql('HEY JUDE');

        });

        it('should return the decoded special word for one special word input', () => {
            
            expect(decode('...---...')).to.eql('SOS');

        });

        it('should raise an exception for not valid input', () => {
            expect(function () {
                decode('.- -...   .-.-. .-- . .-.');
            }).to.throw(Error, 'Illegal morse character');
        });
    });
});
