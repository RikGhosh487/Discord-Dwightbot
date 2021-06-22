const Initialize = require('./initialize');

const dictionary = Initialize.loadDictionary();

module.exports = {
    wordLength: async input => {
        let wordlength = parseInt(input);
        if(Number.isNaN(wordlength)) return 'Not a valid number.';  // check to ensure User entered a number
        if(wordlength < 0) return `Are you stupid. Go back to Elementary School, you idiot,` 
                + ` choosing a word of size **${wordlength}**`;     // negatives handling
        let count = 0;
        dictionary.forEach(elem => count += elem.length == wordlength ? 1 : 0); // count words with given size
        if(count === 0) {
            if(wordlength < 2) return `Can't find words of that length in my dictionary`;
            return `That is just too big of a size.\n\nThat's what she said.`
        }
        return `Working`;
    }
}