module.exports = {
    checkProfanity: (message, bannedWords) => {
        for(const word of bannedWords) {
            if(message.indexOf(word) > -1) {
                return true;
            }
        }
        return false;
    }
}
