const Initialize = require('./initialize');
const Settings = require('./settings.json');

const dictionary = Initialize.loadDictionary();
let activeWords = [];
let guessesMade = [];
let patternMap = new Map();
const filterWords = size => activeWords = dictionary.filter(elem => elem.length === size);
const basePattern = size => '-'.repeat(size);
const countUnknowns = pattern => {
    let count = 0;
    for(let i = 0; i < pattern.length; i++) count += pattern.charAt(i) === '-' ? 1 : 0;
    return count;
}
const patternMaker = (base, word, guess) => {
    for(let i = 0; i < word.length; i++)
        if(word.substring(i, i + 1) === guess)
            base = base.substring(0, i) + guess + base.substring(i + 1);
    return base;
}
function selectPattern(input, pattern) {
    patternMap.clear();
    let temp = [];
    activeWords.forEach(elem => {
        let newpattern = patternMaker(pattern, elem, input);
        temp.push([newpattern, elem]);
    });
    temp.forEach(elem => {
        let pat = elem[0];
        if(!patternMap.has(pat)) {
            patternMap.set(pat, []);
        }
        patternMap.get(pat).push(elem[1]);
    });
    let keys = [];
    patternMap.forEach((v, k) => keys.push([k, v.length]));
    keys.sort((a, b) => {
        let aUnknowns = countUnknowns(a[0]);
        let bUnknowns = countUnknowns(b[0]);
        if((aUnknowns === bUnknowns) && (a[1] === b[1])) return a[0].localeCompare(b[0]);
        if((a[1] === b[1])) return bUnknowns - aUnknowns;
        return b[1] - a[1];
    });
    activeWords = patternMap.get(keys[0][0]);
    return keys[0][0];
}

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
        return [`Working`, !flag, wordlength, `${basePattern(wordlength)}`];// success case
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
    parseInput: async (input, pattern, wrongs, words=[]) => {
        // input corrections
        if(input.length > 1) return ['Only accepting 1 character', pattern, wrongs - 1, activeWords];
        input = input.toLowerCase();
        if(input < 0x61 || input > 0x7A) return ['Only alphabets allowed', pattern, wrongs - 1, activeWords];
        if(guessesMade.includes(input)) 
            return [`${guessesMade}\n` + `Already guessed ${input}`, pattern, wrongs, activeWords];
        guessesMade.push(input);
        guessesMade.sort();
        let newPattern = selectPattern(input, pattern);
        if(newPattern === pattern)
            return [`${guessesMade}\n` + 'Sorry, wrong guess', pattern, wrongs - 1, activeWords];
        pattern = newPattern;
        if(countUnknowns(pattern) === 0) {
            activeWords = [];
            guessesMade = [];
            patternMap.clear();
            return ['You did it', Settings['hangman-secret'], wrongs, pattern];
        }
        return [`${guessesMade}`, pattern, wrongs, activeWords];
    },
    clean: async () => {
        activeWords = [];
        guessesMade = [];
        patternMap.clear();
    }
}