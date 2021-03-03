const fs = require('fs');
const readLine = require('readline');

module.exports = {
    loadBannedWords: () => {
        const bannedWords = [];
        const filename = 'curses.txt';
        readLine.createInterface({
            input: fs.createReadStream(filename),
            terminal: false
        })
        .on('line', line => {
            bannedWords.push(line);
        });
        return bannedWords;
    },

    loadDwightQuotes: () => {
        const quotes = [];
        const filename = 'quotes.txt';
        readLine.createInterface({
            input: fs.createReadStream(filename),
            terminal: false
        })
        .on('line', line => {
            quotes.push(line);
        });
        return quotes;
    },

    loadSongs: () => {
        const songs = [];
        const filename = 'audiofiles.txt';
        readLine.createInterface({
            input: fs.createReadStream(filename),
            terminal: false
        })
        .on('line', line => {
            let temp = line.split('_');
            let song = {title: temp[0], file: temp[1]};
            songs.push(song);
        });
        return songs;
    },

    loadDictionary: () => {
        const dictionary = [];
        const filename = 'dictionary.txt';
        readLine.createInterface({
            input: fs.createReadStream(filename),
            terminal: false
        })
        .on('line', line => {
            dictionary.push(line);
        });
        return dictionary;
    },

    loadSpeech: () => {
        const speeches = [];
        const filename = 'speech.txt';
        readLine.createInterface({
            input: fs.createReadStream(filename),
            terminal: false
        })
        .on('line', line => {
            let temp = line.split('~');
            let speech = {title: temp[0], author: temp[1], body: temp[2]};
            speeches.push(speech);
        });
        return speeches;
    }
}