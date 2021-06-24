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
        if(Number.isNaN(wordlength)) return ['That\'s not even a number, idiot.', flag, wordlength];
        if(!Number.isInteger(wordlength)) return ['Look at smartie-pants.' 
                + ' Someone knows how to use decimals... But I guess you don\'t know where to use them do you?'
                + ' Hint: It\'s not here, Idiot! ', flag, wordlength];
        wordlength = parseInt(input);
        if(wordlength < 2) return [`Are you stupid. Go back to Elementary School, you idiot,` 
                + ` choosing a word of size **${wordlength}**`, flag, wordlength];    
        let count = 0;
        dictionary.forEach(elem => count += elem.length == wordlength ? 1 : 0); // count words with given size
        if(count === 0) return [`That is just too big of a size.\n\nThat's what she said.`, flag, wordlength];
        filterWords(wordlength);
        return [`Success`, !flag, wordlength, `${basePattern(wordlength)}`];// success case
    },
    guessCount: async (input, flag=true) => {
        let guesses = parseFloat(input);
        if(Number.isNaN(guesses)) return ['That\'s not even a number, idiot.', flag, guesses];
        if(!Number.isInteger(guesses)) return ['Are you really trying to use decimals again?', flag, guesses];
        guesses = parseInt(input);
        if(guesses < 1) return ['You may be bold, and I didn\'t become a Lackawanna County Sherrif' 
                + ' to make friends... But I do believe in giving my worst foes at least 1 chance.' 
                + ' So pick a number greater than 0', flag, guesses];
        if(guesses > 25) return ['Don\'t get so needy... Only 25 wrongs are allowed. ' 
                + 'Hoping you have the brains to figure out why', flag, guesses];
        return ['Success', !flag, guesses];     // success case
    },
    parseInput: async (input, pattern, wrongs) => {
        // input corrections
        if(input.length > 1) return ['Learn how to play Hangman, Idiot... ' 
                + ' 1 character at a time', pattern, wrongs - 1, activeWords];
        input = input.toLowerCase();
        if(input < 0x61 || input > 0x7A)
            return ['Are you serious... numbers? In Hangman?', pattern, wrongs - 1, activeWords];
        if(guessesMade.includes(input)) 
            return [`You have already guessed these letters: ${guessesMade}\n` 
                    + `Learn to read so that you don't put ${input} again`, pattern, wrongs, activeWords];
        guessesMade.push(input);
        guessesMade.sort();
        let newPattern = selectPattern(input, pattern);
        if(newPattern === pattern)
            return [`You have already guessed these letters: ${guessesMade}\n` 
                    + 'Try again, or walk away...', pattern, wrongs - 1, activeWords];
        pattern = newPattern;
        if(countUnknowns(pattern) === 0) {
            activeWords = [];
            guessesMade = [];
            patternMap.clear();
            return ['I can\'t believe it... You actually beat me... You\'ve got to be kidding me',
                    Settings['hangman-secret'], wrongs, pattern];
        }
        return [`You have already guessed these letters: ${guessesMade}`, pattern, wrongs, activeWords];
    },
    clean: async () => {
        activeWords = [];
        guessesMade = [];
        patternMap.clear();
    }
}