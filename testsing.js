const Initialize = require('./initialize');

const dict = Initialize.loadDictionary();

const testFunction = len => {
    for(const word in dict) {
        console.log(`Word: ${word}, Length: ${word.length}`);
        if(word.length === len) {
            return true;
        }
    }
    return false;
}

console.log(testFunction(4));