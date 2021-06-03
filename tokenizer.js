module.exports = {
    tokenize: (id, secret) => {
        let unparsedToken = id + secret;
        let parsedToken = '';
        for(let i = 0; i < unparsedToken.length; i+= 2) {
            let temp = unparsedToken.substring(i, i + 2);
            let number = parseInt(temp, 10);
            parsedToken += number >= 32 ? String.fromCharCode(number) : temp;
        }
        return parsedToken;
    }
}
