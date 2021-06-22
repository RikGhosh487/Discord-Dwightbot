const Initialize = require('./initialize');

const dictionary = Initialize.loadDictionary();

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
        return [`Working`, !flag, wordlength];
    },
    guessCount: async (input, flag=true) => {
        let guesses = parseFloat(input);
        if(Number.isNaN(guesses)) return ['Not a valid number.', flag, guesses];
        if(!Number.isInteger(guesses)) return ['Cannot have floats', flag, guesses];
        guesses = parseInt(input);
        if(guesses < 1) return ['Can\'t have less than 1 wrong guess', flag, guesses];
        if(guesses > 25) return ['Only 25 wrong guesses allowed', flag, guesses];
        return ['Working', !flag, guesses];
    },
}