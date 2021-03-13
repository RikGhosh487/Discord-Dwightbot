module.exports = {
    checkProfanity: (message, bannedWords) => {
        message = message.split(" ");
        for (const word of message) {
            if(bannedWords.includes(word)) return true;
        }
        return false;
    }
}
