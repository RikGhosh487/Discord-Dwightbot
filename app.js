/**
 * @description Simple Discord bot themed with Dwight K. Shrute with multi-facated functionality
 * 
 * @author Rik Ghosh
 * @author Soham Saha
 * @version 1.5.1
 * @copyright 2021 
 */

// custom imports from local files
const Hangman  = require('./hangman');          // used to control hangman modules
const Initialize = require('./initialize');     // used to populate all arrays in streams to conserve data
const Punishment = require('./punishment');     // used to check for cursewords
const Settings = require('./settings.json');    // used to get bot token from the app's API
const Suggestions = require('./suggestions');   // used to produce top 10 lists
const Tokens = require('./tokenizer');          // used to generate tokens for IDs

// node.js module imports
const Discord = require('discord.js');
const exec = require('child_process').exec;

// general constants and initializers   [@version 1.0.0 : General Setup]
const client = new Discord.Client();
const prefix = '?';
const timeoutBase = 120_000;

// dwight quotes constant(s) and function(s)  [@version 1.1.7 : Dwight Quotes Update]
const quotes = Initialize.loadDwightQuotes();
const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

// profanity management constant [@version 1.2.4 : Profanity Filter Update]
const bannedWords = Initialize.loadBannedWords();

// domination constant(s) and function(s) [@version 1.2.8 : Domination Update]
const dominate = () => Math.random() > 0.1;
const usertag = ['MrNoobKille.r#1903'];

// music constant(s) and function(s) [@version 1.3.1 : Music Update]
const randomSong = () => songs[Math.floor(Math.random() * songs.length)];
const songs = Initialize.loadSongs();

// speech constant(s) and functions(s) [@version 1.4.2 : Speech Update]
const printSpeech = () => speech[Math.floor(Math.random() * speech.length)];
const speech = Initialize.loadSpeech();

// episode search constant(s) and function(s) [@version 1.5.0 : Episode Search Update]
const episodes = Initialize.loadEpisodes();
const fetchEpisode = () => episodes[Math.floor(Math.random() * episodes.length)];
const fieldPop = episodeList => {
    const fields = [];
    let data1 = '';
    let data2 = '';
    for(const epi of episodeList) {
        data1 += epi.season + ' x ' + epi.episode + '\n';
        data2 += epi.title.substring(1, epi.title.length - 1) + '\n';
    }
    let obj1 = { name: 'Episode', value: data1, inline: true };
    let obj2 = { name: 'Title', value: data2, inline: true };
    fields.push(obj1, obj2);
    return fields;
}
const seasonInfo = {1: { color: '#fff777',
        image: 'https://static.wikia.nocookie.net/theoffice/images/' 
        + '4/44/Season1DVD.jpg/revision/latest?cb=20100115211205'},
        2: { color: '#cae2f2',
        image: 'https://static.wikia.nocookie.net/theoffice/images'
        + '/e/ee/Season2DVD.jpg/revision/latest?cb=20060831222832'},
        3: { color: '#6cbbf3',
        image: 'https://static.wikia.nocookie.net/theoffice/images'
        + '/f/f9/Season3DVD.jpg/revision/latest?cb=20070814160258'},
        4: { color: '#4e4a4a',
        image: 'https://static.wikia.nocookie.net/theoffice/images'
        + '/3/3c/Season4DVD.jpg/revision/latest?cb=20080903180804'},
        5: { color: '#e4ded0',
        image: 'https://static.wikia.nocookie.net/theoffice/images'
        + '/7/7c/Season5DVD.jpg/revision/latest?cb=20091221142407'},
        6: { color: '#9a3442',
        image: 'https://static.wikia.nocookie.net/theoffice/images'
        + '/a/a5/TheOffice_S6_DVD.jpg/revision/latest?cb=20100607063143'},
        7: { color: '#c59765',
        image: 'https://static.wikia.nocookie.net/theoffice/images'
        + '/a/a5/Seasonseven.jpg/revision/latest?cb=20120628201751'},
        8: { color: '#5ead8d',
        image: 'https://static.wikia.nocookie.net/theoffice'
        + '/images/a/ae/The_Office_Season_8.jpg/revision/latest?cb=20120906230835'},
        9: { color: '#a7d9f3',
        image: 'https://static.wikia.nocookie.net/theoffice/images'
        + '/3/32/The_Office_S9_DVD.jpg/revision/latest?cb=20130523201552'}};

// hangman constants and variables
let userToken = undefined;
let channelToken = undefined;
let pattern = undefined;
let wrongs = undefined;
let lengthFlag = false;
let guessFlag = false;
const readHangman = (author, channel) => author === userToken && channel === channelToken;

client.once('ready', () => {
    console.log('Bot Ready!');
    client.user.setPresence({ status: 'invisible' });   // sets bot invisible to users
});

client.on('message', async message => {
    if(message.author.bot) return;  // ignore messages from another bot
    let authorToken = Tokens.tokenize(message.author.id, Settings['hangman-secret']);
    let sourceToken = Tokens.tokenize(message.channel.id, Settings['hangman-secret']);
    if(message.content.startsWith(prefix) && readHangman(authorToken, sourceToken)) {
        const command = message.content.slice(prefix.length).toLowerCase();
        if(command === 'quit') {
            userToken = undefined;
            channelToken = undefined;
            lengthFlag = false;
            guessFlag = false;
            await Hangman.clean();
            return;
        }
    }
    if(readHangman(authorToken, sourceToken)) {
        if(lengthFlag) {
            const output = await Hangman.wordLength(message.content, lengthFlag);
            lengthFlag = output[1];
            if(lengthFlag) {
                message.channel.send(output[0]);
                return message.channel.send('Pick a length for your word, again...');
            }
            pattern = output[3];
            return message.channel.send('Pick the number of wrong guesses you want to allow');
        }
        if(guessFlag) {
            const output = await Hangman.guessCount(message.content, guessFlag);
            guessFlag = output[1];
            if(guessFlag) {
                message.channel.send(output[0]);
                return message.channel.send('Pick the number of wrong guesses you want to allow, again...');
            }
            wrongs = output[2];
            message.channel.send('Start Guessing...');
            return message.channel.send(pattern);
        }
        const result = await Hangman.parseInput(message.content, pattern, wrongs);
        pattern = result[1];
        wrongs = result[2];
        message.channel.send(result[0]);
        if(wrongs === 0) { 
            userToken = channelToken = undefined;
            lengthFlag = guessFlag = false;
            await Hangman.clean();
            let answer = result[3][Math.floor(Math.random() * result[0].length)];
            message.channel.send(`The correct answer was **${answer}**`);
            return message.channel.send('You are out of turns.');
        }
        if(pattern === Settings['hangman-secret']) {
            userToken = channelToken = undefined;
            lengthFlag = guessFlag = false;
            await Hangman.clean();
            message.channel.send(`The answer was **${result[3]}**`);
            return message.channel.send('You Win');
        }
        return message.channel.send(pattern);
    }
});


client.on('message', async message => {
    if(message.author.bot) return;  // ignore messages from another bot
    // master commands for the bot
    let authorToken = Tokens.tokenize(message.author.id, Settings['hangman-secret']);
    let sourceToken = Tokens.tokenize(message.channel.id, Settings['hangman-secret']);
    if(message.content.startsWith(prefix) && !readHangman(authorToken, sourceToken)) {
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
        if(command.startsWith('theme(') && command.endsWith(')')) { // indexed version of theme command
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
            let index = parseInt(command.substring(6, command.length - 1));
            index = index >= 0 && index < songs.length ? index : 0;
            const currentSong = songs[index];
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
        /******************** Speech [ @version 1.4.2 ] ********************/
        if(command === 'speech' || command === 'dwight speech') {
            const currentSpeech = printSpeech();
            const embeddedMessage = new Discord.MessageEmbed();
            embeddedMessage.setColor('#bf5700');
            embeddedMessage.setAuthor(currentSpeech.author);
            embeddedMessage.setTitle(currentSpeech.title);
            embeddedMessage.setDescription(currentSpeech.body);
            return message.channel.send(embeddedMessage) // prints out one of the several speeches
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
        }
        /******************** Episode Search [ @version 1.5.0 ] ********************/
        if(command === 'episode' || command === 'watch episode') {
            const randomEpisode = fetchEpisode();
            const embeddedMessage = new Discord.MessageEmbed();
            embeddedMessage.setColor(seasonInfo[randomEpisode.season].color);
            embeddedMessage.setTitle(randomEpisode.season + 'x' + randomEpisode.episode 
                    + ": " + randomEpisode.title);
            embeddedMessage.setURL('https://watchtheoffice.cc/episodes/the-office-' +
                    randomEpisode.season + 'x' + randomEpisode.episode + '/');
            embeddedMessage.setAuthor('Dwight K. Schrute', seasonInfo[randomEpisode.season].image);
            embeddedMessage.setThumbnail(seasonInfo[randomEpisode.season].image);
            embeddedMessage.setImage(seasonInfo[randomEpisode.season].image);
            embeddedMessage.setTimestamp();
            embeddedMessage.addFields(
                { name: 'Season',  value: '' + randomEpisode.season, inline: true},
                { name: 'Episode',  value: '' + randomEpisode.episode, inline: true},
                { name: 'Episode ID', value: randomEpisode.id, inline: true},
                { name: 'Views (on the day of release)',  value: randomEpisode.views + ' million', inline: true}
            );
            return message.channel.send(embeddedMessage)
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase * 2 }));
        }
        if(command.startsWith('episode(') && command.endsWith(')')) {   // indexed version of episode searching
            let passedValue = command.substring(8, command.length - 1);
            if(!passedValue.startsWith('@')) {
                return message.channel.send('Missing id prefix. Please add `@` before the episode id')
                        .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
            }
            let index = parseInt(passedValue.slice(1));
            if(isNaN(index) || index <= 0 || index > episodes.length) {
                return message.channel.send('Not a valid episode id. Please select a valid episode id to make a fetch request')
                        .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
            }
            const requestedEpisode = episodes[index - 1];
            const embeddedMessage = new Discord.MessageEmbed();
            embeddedMessage.setColor(seasonInfo[requestedEpisode.season].color);
            embeddedMessage.setTitle(requestedEpisode.season + 'x' + requestedEpisode.episode 
                    + ": " + requestedEpisode.title);
            embeddedMessage.setURL('https://watchtheoffice.cc/episodes/the-office-' +
                    requestedEpisode.season + 'x' + requestedEpisode.episode + '/');
            embeddedMessage.setAuthor('Dwight K. Schrute', seasonInfo[requestedEpisode.season].image);
            embeddedMessage.setThumbnail(seasonInfo[requestedEpisode.season].image);
            embeddedMessage.setImage(seasonInfo[requestedEpisode.season].image);
            embeddedMessage.setTimestamp();
            embeddedMessage.addFields(
                { name: 'Season',  value: '' + requestedEpisode.season, inline: true},
                { name: 'Episode',  value: '' + requestedEpisode.episode, inline: true},
                { name: 'Episode ID', value: requestedEpisode.id, inline: true},
                { name: 'Views (on the day of release)',  value: requestedEpisode.views + ' million', inline: true}
            );
            return message.channel.send(embeddedMessage)
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase * 2}));
        }
        if(command === 'dwight\'s monthly pick' || command === 'dmp') {
            const currentDate = new Date(Date.now());
            const month = currentDate.getMonth();
            const date = currentDate.getDate();
            const selectedEpisodes = Suggestions.top10monthly(month, date);
            const theme = Suggestions.getTheme(month, date);
            const embeddedMessage = new Discord.MessageEmbed();
            embeddedMessage.setColor('#bf5700');
            embeddedMessage.setTitle('Dwight\'s Top 10 Episode List');
            embeddedMessage.setTimestamp();
            embeddedMessage.setDescription(theme);
            embeddedMessage.addFields(fieldPop(selectedEpisodes));
            return message.channel.send(embeddedMessage)
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
        }
        /******************** Hangman Activation [ @version 1.4.1 ] ********************/
        if(command === 'hangman') {
            if(userToken !== undefined || channelToken !== undefined) {
                return message.channel.send(`Are you really that dumb ${message.author.username}...` 
                        + ` You can't possibly start another hangman game while one session is already active`
                        + `. Uhh... I can't believe you're this stupid.`)
                        .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
            }
            message.channel.send(`So, you think you're good at playing hangman, huh?\n**False**.\n` 
                    + `You can never beat me, never achieve *perfectenschlag*, but I will give you a`
                    + ` chance to prove yourself. Lets see how good you are ${message.author.username}`)
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase * 2}));
            userToken = Tokens.tokenize(message.author.id, Settings['hangman-secret']);
            channelToken = Tokens.tokenize(message.channel.id, Settings['hangman-secret']);
            lengthFlag = guessFlag = true;
            return message.channel.send('Pick a length for your word')
                    .then(sentMessage => sentMessage.delete({ timeout: timeoutBase * 2 }));
        }
        // if(command === 'quit') {
        //     return message.channel.send(`On wow! You haven't even started and are calling quits...` 
        //             + ` You're a disgrace to Dunder Mifflin ${message.author}`)
        //             .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
        // }
    }
});

/******************** Hangman Manager [ @version 1.4.2 ] ********************/
//     client.on('message', async message => {
//         // only handle requests for the player and in the same channel
//         if(message.author === hangmanUser && message.channel === hangmanChannel) {
//             // active commands for the player
//             if(message.content.startsWith(prefix)) {
//                 const command = message.content.slice(prefix.length).toLowerCase();
//                 if(command === 'hangman' && lobby.length > 0) {
//                     return hangmanChannel.send(`Are you really that dumb ${message.author.username}...` 
//                             + ` You can't possibly start another hangman game while you're` 
//                             + ` already playing one. Uhh... I can't believe you're this stupid.`)
//                             .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
//                 } else if(command === 'quit') {
//                     // reset commands that deletes previous code and sets up the environment for the next player
//                     hangmanChannel.send('Yeah, that\'s right... back away loser.')
//                             .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
//                     hangmanActive = false;
//                     lobby.pop();
//                     hangmanUser = undefined;
//                     hangmanChannel = undefined;
//                     return wordLengthCollected = false;
//                 } else {
//                     hangmanChannel.send('If you want to use the other commands, you need to chicken' 
//                             + ' out of this hangman game')
//                             .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
//                     return hangmanChannel.send('Might as well go ahead and call the `?quit` command, you IDIOT')
//                             .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
//                 }
//             } else {
//                 // prompted requests
//                 if(!wordLengthCollected) {
//                     while(wordLength === undefined) {
//                         let userInput = parseInt(message.content.toLowerCase());
//                         wordLength = !Number.isNaN(userInput) && wordsExist(userInput) ? userInput : undefined;
//                         if(wordLength === undefined) {
//                             return hangmanChannel.send('Pick a word length for your hangman game')
//                                     .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
//                         }
//                     }
//                     populateActiveWords(wordLength);
//                     console.log(activeWords);
//                     wordLengthCollected = true; // turn off flag warning
//                 } else {
//                     console.log('doing nothing');
//                 }
//             }
//         }
        
//     });
// }

// hangman helper functions
// const wordsExist = len => {
//     for(let i = 0; i < evilHangmanDictionary.length; i++) {
//         const word = evilHangmanDictionary[i];
//         if(word.length === len) {
//             return true;
//         }
//     }
//     hangmanChannel.send('The size is too long...')
//             .then(sentMessage => sentMessage.delete({ timeout: timeoutBase }));
//     hangmanChannel.send('That\'s what she said!');
//     return false;
// };

// const populateActiveWords = wordLen => {
//     evilHangmanDictionary.forEach(element => {
//         if(element.length === wordLen) {
//             activeWords.push(element);
//         }
//     });
// }

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
    if(usertag.includes(message.author.tag) && dominate()) { // has a 9 percent chance of writing
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