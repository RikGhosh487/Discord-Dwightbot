const Initialize = require('./initialize');
const Settings = require('./settings.json');

const dictionary = Initialize.loadDictionary();
let activeWords = [];
const guessesMade = [];
const filterWords = size => activeWords = dictionary.filter(elem => elem.length === size);
const basePattern = size => '- '.repeat(size);

module.exports = {
    wordLength: async (input, flag=true) => {
        let wordlength = parseFloat(input);
        if(Number.isNaN(wordlength)) return ['Not a valid number.', flag, wordlength];
        if(!Number.isInteger(wordlength)) return ['Cannot have floats', flag, wordlength];
        wordlength = parseInt(input);
        if(wordlength < 2) return [`Are you stupid. Go back to Elementary School, you idiot,` 
                + ` choosing a word of size **${wordlength}**`, flag, wordlength];    
        let count = 0;
        dictionary.forEach(elem => count += elem.length == wordlength ? 1 : 0); // count words with given size
        if(count === 0) return [`That is just too big of a size.\n\nThat's what she said.`, flag, wordlength];
        filterWords(wordlength);
        return [`Working`, !flag, wordlength, `**${basePattern(wordlength)}**`];// success case
    },
    guessCount: async (input, flag=true) => {
        let guesses = parseFloat(input);
        if(Number.isNaN(guesses)) return ['Not a valid number.', flag, guesses];
        if(!Number.isInteger(guesses)) return ['Cannot have floats', flag, guesses];
        guesses = parseInt(input);
        if(guesses < 1) return ['Can\'t have less than 1 wrong guess', flag, guesses];
        if(guesses > 25) return ['Only 25 wrong guesses allowed', flag, guesses];
        return ['Working', !flag, guesses];     // success case
    },
    parseInput: async (input, pattern, wrongs, read=false) => {
        // input corrections
        if(input.length > 1) return ['Only accepting 1 character', pattern, wrongs - 1, !read];
        input = input.toLowerCase();
        if(input < 0x61 || input > 0x7A) return ['Only alphabets allowed', pattern, wrongs - 1, !read];
        
        // if(pattern.indexOf('-') === -1) return ['Working', Settings['hangman-secret'], wrongs, read];
        return ['Working', pattern, wrongs, read];
    }
}