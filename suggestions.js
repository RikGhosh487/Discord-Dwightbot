const Initialize = require('./initialize');
const cutOff = 35;
const episodes = Initialize.loadEpisodes();
const holidayList = ['christmas', 'diwali', 'halloween', 'valentine', 'santa', 'patrick', ]
const maxDayValue = 31;
const monthID = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'
        , 'September', 'October', 'November', 'December'];
const theme = ['Creme de la Creme', 'Alphabetically Sorted for the OCDs (Ascending)', 'Final Few Goodbyes'
        , 'Everyone deserves a Second, Second Chance', 'The Centurion Club', 'Specials from Season 5'
        , 'Alphabetically Sorted for the OCDs (Descending)', 'The Middle Layer', 'Best of both Days'
        , 'Specials from Season 4', 'Specials from Season 7', 'Holiday Specials', 'Daily Picks'];
let defaultFlag = false;

const hashedDay = day => {
    if(day % 2 == 0) return (0xDC ^ day * parseInt(episodes.length / maxDayValue)) % episodes.length;
    return (0xDC ^ day * parseInt(episodes.length / maxDayValue) + 1) % episodes.length;
}

const defaultList = day => {
    const defList = [];
    let index = hashedDay(day);
    for(let i = 0; i < 10; i++) {
        defList.push(episodes[index]);
        index = Math.abs((index + day) % episodes.length);
    }
    return defList;
}

const fisherYatesShuffle = array => {
    let numToShuffle = array.length;
    let temp;
    let randomElem;
    while(numToShuffle != 0) {
        randomElem = Math.floor(Math.random() * numToShuffle);
        numToShuffle--;
        temp = array[randomElem];
        array[numToShuffle] = array[randomElem];
        array[randomElem] = temp;
    }
    return array;
}

module.exports = {
    top10monthly: (month, day, randomChance = 0.15, forceDefault=false) => {
        const top10 = defaultList(day);
        let subset = [];
        if(Math.random() > randomChance && !forceDefault) {
            switch(month) {
                case 0: // sorted by most views
                    subset = episodes.sort((a, b) => b.views - a.views).slice(0, cutOff);
                    break;
                case 1: // sorted by titles
                    subset = episodes.sort((a, b) => a.title > b.title ? 1 : (a.title < b.title ? -1 : 0))
                            .slice(0, cutOff);
                    break;
                case 2: // sorted by last episodes
                    subset = episodes.sort((a, b) => b.episode - a.episode).slice(0, cutOff);
                    break;
                case 3: // sorted by lowest views
                    subset = episodes.sort((a, b) => a.views - b.views).slice(0, cutOff);
                    break;
                case 4: // centurion club
                    let limit = 0;
                    while(limit < cutOff) {
                        subset.push(episodes[Math.floor(Math.random() * (episodes.length - 100)) + 100]);
                        limit++;
                    }
                    break;
                case 5: // season 5 specials
                    for(const epi of episodes) {
                        if(epi.season === 5) subset.push(epi);
                        if(epi.season === 6) break;
                    }
                    break;
                case 6: // descending title sort
                    subset = episodes.sort((a, b) => a.title > b.title ? -1 : (a.title < b.title ? 1 : 0))
                            .slice(0, cutOff);
                    break;
                case 7: // middle layer for views
                    for(const epi of episodes) {
                        if(epi.views >= 6.5 && epi.views <= 8.0) subset.push(epi);
                    }
                    subset = fisherYatesShuffle(subset).slice(0, cutOff);
                    break;
                case 8: // consecutive day daily list
                    subset = subset.concat(top10, defaultList(day % 31 + 1));
                    subset = fisherYatesShuffle(subset);
                    break;
                case 9: // season 4 specials
                    for(const epi of episodes) {
                        if(epi.season === 4) subset.push(epi);
                        if(epi.season === 5) break;
                    }
                    break;
                case 10: // season 7 specials
                    for(const epi of episodes) {
                        if(epi.season === 7) subset.push(epi);
                        if(epi.season === 8) break;
                    }
                    break;
                case 11: // holiday specials
                    for(const epi of episodes) {
                        let title = epi.title.toLowerCase();
                        for(const word of holidayList) {
                            if(title.indexOf(word) >= 0) {
                                subset.push(epi);
                                break;
                            }
                        }
                    }
                    break;
            }
        }
        if(subset.length === 0 || forceDefault) {
            console.log('Printed default list');
            defaultFlag = true;
            return top10;
        }
        for(let i = 0; i < 10; i++) {
            let elem = subset[Math.floor(Math.random() * subset.length)];
            while(top10.includes(elem)) elem = subset[Math.floor(Math.random() * subset.length)];
            top10[i] = elem;
        }
        defaultFlag = false;
        return top10;
    },
    getTheme: (month, date, forceDefault = false) => {
        return forceDefault || defaultFlag ?
                theme[theme.length - 1] + ' (' + monthID[month] + ', ' + date + ')' : theme[month];
    }
}