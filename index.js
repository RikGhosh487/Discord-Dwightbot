/**
 * @description Simple Discord bot themed with Dwight K. Shrute with multi-facated functionality
 * 
 * @author Rik Ghosh
 * @author Soham Saha
 * @version 1.4.1
 * @copyright 2021 
 */

// custom imports from local files
const Initialize = require('./initialize');     // used to populate all arrays in streams to conserve data
const Punishment = require('./punishment');     // used to check for cursewords and log information
const Settings = require('./settings.json');    // used to get bot token from the app's API

// node.js module imports
const Discord = require('discord.js');
const fs = require('fs');

// general constants and initializers   [@version 1.0.0 : General Setup]
const client = new Discord.Client();
const prefix = '?';
const timeoutBase = 120_000;
const sleep = milliseconds => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while(currentDate - date < milliseconds);
};

// dwight quotes constant(s) and function(s)  [@version 1.1.7 : Dwight Quotes Update]
const quotes = Initialize.loadDwightQuotes();
const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

// profanity management constant [@version 1.2.4 : Profanity Filter Update]
const bannedWords = Initialize.loadBannedWords();

// domination constant(s) and function(s) [@version 1.2.8 : Domination Update]
const dominate = () => Math.random() > 0.1;
const usertag = 'Mister_Noob_Killer';

// music constant(s) and function(s) [@version 1.3.1 : Music Update]
const randomSong = () => songs[Math.floor(Math.random() * songs.length)];
const songs = Initialize.loadSongs();

// hangman constants and variables
const evilHangmanDictionary = Initialize.loadDictionary();
const maxGuesses = 25;
const easy = 1;
const medium = 2;
const hard = 3;
const guessedLetters = [];
const lobby = [];
const activeWords = [];
let hangmanChannel;
let hangmanActive = false;
let hangmanUser;
let wordLength;
let wordLengthCollected = false;

client.once('ready', () => {
    console.log('Bot Ready!');
    client.user.setPresence({ status: 'invisible' });   // sets bot invisible to users
});


client.on('message', async message => {
    if(message.author.bot) return;  // ignore messages from another bot
    // master commands for the bot
    if(message.content.startsWith(prefix) && (hangmanUser === undefined || hangmanUser !== message.author)) {
        const command = message.content.slice(prefix.length).toLowerCase();
        /******************** Dwight Quotes [ @version 1.1.7 ] ********************/
        if(command === 'inspire me dwight' || command === 'imd') {
            return message.reply(randomQuote()) // deletes reply after timeoutBase mil
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
        }
        /******************** Music [ @version 1.3.1 ] ********************/
        if (command === 'play theme' || command === 'theme' || command === 'play') {
            const voiceChannel = message.member.voice.channel;  // check to see if the author is in a VC
            if(!voiceChannel) {
                return message.channel.send('Do you even realize that in order to hear something, you need' 
                        + ' to be in a Voice Channel')
                        .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
            }
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) {  // check for permissions
                return message.channel.send('You cannot bar my managerial rights to speak and talk in ' 
                        + 'a Voice Channel. I will go tell Michael and you shall face the consequences')
                        .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
            }
            const currentSong = randomSong();
            voiceChannel.join().then(connection => {
                const dispatcher = connection.play('./audio/' + currentSong.file);
                message.channel.send(`I see you have discovered DJ Dwight...` 
                        + ` You're currently listening to ${currentSong.title}`)
                        .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
                dispatcher.setVolume(1);
                dispatcher.on('finish', () => {
                    voiceChannel.leave();
                    message.channel.send(`Show's over ${message.author.username}... Go Home`)
                            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
                });
            }).catch(err => console.error(err));
            return;
        }
        /******************** Hangman Activation [ @version 1.4.1 ] ********************/
        if(command === 'hangman') {
            if(hangmanActive) {
                return message.channel.send(`Are you really that dumb ${message.author.username}...` 
                        + ` You can't possibly start another hangman game while you're already playing one`
                        + `. Uhh... I can't believe you're this stupid.`)
                        .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
            }
            hangmanActive = true;
            hangmanUser = message.author;
            hangmanChannel = message.channel;
            lobby.push(hangmanUser);
            hangman();
            return;
        }
        if(command === 'quit') {
            return message.channel.send(`On wow! You haven't even started and are calling quits...` 
                    + ` You're a disgrace to Dunder Mifflin ${message.author}`)
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
        }
    }
});

/******************** Hangman Manager [ @version 1.4.2 ] ********************/
const hangman = () => {
    hangmanChannel.send(`So, you think you're good at playing hangman, huh?` 
            + ` Let's see how good you are, ${hangmanUser}`)
            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
    hangmanChannel.send('Pick a word length for your hangman game')
            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
    // check for commands being used
    client.on('message', async message => {
        // only handle requests for the player and in the same channel
        if(message.author === hangmanUser && message.channel === hangmanChannel) {
            // active commands for the player
            if(message.content.startsWith(prefix)) {
                const command = message.content.slice(prefix.length).toLowerCase();
                if(command === 'hangman' && lobby.length > 0) {
                    return hangmanChannel.send(`Are you really that dumb ${message.author.username}...` 
                            + ` You can't possibly start another hangman game while you're` 
                            + ` already playing one. Uhh... I can't believe you're this stupid.`)
                            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
                } else if(command === 'quit') {
                    // reset commands that deletes previous code and sets up the environment for the next player
                    hangmanChannel.send('Yeah, that\'s right... back away loser.')
                            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
                    hangmanActive = false;
                    lobby.pop();
                    hangmanUser = undefined;
                    hangmanChannel = undefined;
                    return wordLengthCollected = false;
                } else {
                    hangmanChannel.send('If you want to use the other commands, you need to chicken' 
                            + ' out of this hangman game')
                            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
                    return hangmanChannel.send('Might as well go ahead and call the `?quit` command, you IDIOT')
                            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
                }
            } else {
                // prompted requests
                if(!wordLengthCollected) {
                    while(wordLength === undefined) {
                        let userInput = parseInt(message.content.toLowerCase());
                        wordLength = !Number.isNaN(userInput) && wordsExist(userInput) ? userInput : undefined;
                        if(wordLength === undefined) {
                            return hangmanChannel.send('Pick a word length for your hangman game')
                                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
                        }
                    }
                    populateActiveWords(wordLength);
                    console.log(activeWords);
                    wordLengthCollected = true; // turn off flag warning
                } else {
                    console.log('doing nothing');
                }
            }
        }
        
    });
}

// hangman helper functions
const wordsExist = len => {
    for(let i = 0; i < evilHangmanDictionary.length; i++) {
        const word = evilHangmanDictionary[i];
        if(word.length === len) {
            return true;
        }
    }
    hangmanChannel.send('The size is too long...')
            .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
    hangmanChannel.send('That\'s what she said!');
    return false;
};

const populateActiveWords = wordLen => {
    evilHangmanDictionary.forEach(element => {
        if(element.length === wordLen) {
            activeWords.push(element);
        }
    });
}

// always monitoring bot functions
client.on('message', async message => {
    if(message.author.bot) return;  // ignore messages from another bot
    if(message.mentions.users.has('798967528172027974')) { // response for mentioning the bot
        message.reply('How would I describe myself?')
                .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
        return message.channel.send('Three words: \n**hardworking**, **alpha male**, **jackhammer**,' 
                + ' **merciless**, **insatiable**...')
                .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
    }
    /******************** Domination Control [ @version 1.2.8 ] ********************/
    if(message.author.username === usertag && dominate()) { // has a 9 percent chance of writing
        return message.delete();
    }
    /******************** Profanity Filter [ @version 1.2.4 ] ********************/
    if(Punishment.checkProfanity(message.content.toLowerCase(), bannedWords)) {
        message.delete();
        return message.channel.send(`Get some friends, LOSER... yes you ${message.author}...` 
                + ` you weakling, DWIGHT SHRUTE is the MANAGERRR`)
                .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
    }
});

client.login(Settings['bot-login-token']);  // logs the bot into the server