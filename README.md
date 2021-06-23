# Dwightbot
## General Description
Simple Discord bot themed with Dwight K. Shrute with multi-facated functionality

## Version 1.5.3 - Hangman Interface
Introduced fully working functionality to the 7th job for discord bot. Missing "**DWIGHT SASS**" for full completion.
Typing `?hangman` on your desired `#discord-text-channel` will set up the hangman interface and ask the user for prompts to set up the game environment. When in the interface, no **prefix** is required and the prompt answers can be entered simply. Controls have been put to re-request the user in initial input was invalid. The user does have the choice to quit the interface at anytime using the `?quit` command. While then hangman interface is running, other users won't be able to create a separate instance of the game. The user playing the hangman game in the specific text channel cannot use other commands in that channel while in the interface, but can use the other commands in a **separate channel** if they do wish to. The game protocol is like any **normal hangman game** where the user enters a **single character** to attempt to guess the correct word. If the user runs out of wrong guesses, the game interface will clean up and quit for the user. If the user wins the game, the game interface will clean up and quit once again. In both cases the answer would be announced. If the player force quits using the `?quit` command, then the answer won't be revealed.

## Version 1.5.0 - Episode Highlights Update
Introduced the 6th functionality for discord bot.
Typing `?episode` or `?watch episode` will make the bot print an **embedded message** linking to a random episode of NBC's [The Office](https://www.peacocktv.com/stream-tv/the-office). The embed contain the **season**, the **episode**, the number of **views** it received on the day of the release a **hyperlink** to watch the episode, **DVD cover thumbnail** of the season, and an **id** that will be used for indexed searching of an episode. Using the command `?episode(#)` will fetch the episode with the id of `@#` in the episode list, rather than random index generation. The `?dwight's monthly pick` or `?dmp` command will present Dwight's top 10 list for that month. This command interprets the date and time of the command in real time, and using that information, presents a **themed version** of the top 10 list for each month. If the switch-case fails due to an error, or in a **15%** chance, the default list for that day is presented with a special description. This is also presented as a embed message with a tabular format. The top 10 list provides the season and episode number and the title.

## Version 1.4.2 - Speech Update
Introduced the 5th functionality for discord bot.
Typing `?speech` or `?dwight speech` will make the bot print out one of the speeches delivered by Dwight K. Schrute in NBC's [The Office](https://www.peacocktv.com/stream-tv/the-office). The bot will pick a random speech from the `speech.txt` file and print out the text to the channel as an **embedded message**.

## Version 1.4.1 - Hangman Shell Update
Introduced the basic shell of the 4th functionality for discord bot.
Typing `?hangman` will launch a new playable environment where the user would be able to play hangman in the future. There are plent of bugs and issues with this shell and the code (originally written in **Java** and then reimplemented using **Javascript**) is not fully portable for Discord requirements. Currently includes `?quit` command as well, allowing the user to leave the playable environment. This will feature only single player environments so multiple threads of the hangman interface cannot be generated. The bot will prevent another user from joining if someone is already playing Hangman

## Version 1.3.1 - Music Update
Introduced third functionality for discord bot.
Typing `?theme` or `?play` or `?play theme` while in a Voice Channel will make the bot play a random song that was featured in an episode of [The Office](https://www.peacocktv.com/stream-tv/the-office). After the song is finished, the bot shall automatically leave the Voice Channel and send a reply to notify the user that the song is over. There is not `?skip` or `?leave` command. Potential snarky reply feature may be introduced in the future. Using the command `?theme(#)` will play the song at the `#` index in the song list, rather than the random index generation.

Current List of Available Songs:
- 9,986,000 Minutes
- Best Intro Ever
- Electric City
- In The Jungle
- I Will Remember You
- Male Prima Donna
- Rockin Robin Theme
- Staying Alive
- Sweeney Todd
- That One Night
- The Last Theme
- The Office Main Theme
- The Scarn
- The Wedding Theme
- Threat Level Midnight
- What I Hate About You

**DISCLAIMER** - Contains the original audio clips from NBC's [The Office](https://www.peacocktv.com/stream-tv/the-office). If intending to play these themes while you are streaming on a platform ([YouTube](https://www.youtube.com), [Twitch](https://www.twitch.tv/), or others), please refrain from playing these tracks as you can be subject to **COPYRIGHT ISSUES**.

## Version 1.2.8 - Domination Update
Special user specific functionality added to discord bot.
Continuously monitors the chats to detetch any messages from selected list of server members and **silently** deletes their messages without sending any indication or reply. This domination feature needs to be manually swithced **ON** or **OFF** via hardcoding the flag in `index.js`.

| Update | User Count | Usertag |
| :--- | :---: | :---: |
| `v1.2.8` | 1 | `MrNoobKille.r#1903` |

## Version 1.2.4 - Profanity Filter Update
Introduced second function for discord bot.
Continuously monitors the chats to detect for curse words or slurs stashed in the `curses.txt` file. Once detected, the bot will automatically delete the message and reply with a Dwight Themed Warning. No command is needed for the activation or deactivation of this function.

## Version 1.1.7 - Dwight Quotes Update
Introduced first function for discord bot.
Typing `?inspire me dwight` or `?imd` will pick a random quote in the `quotes.txt` file, and the bot will reply the user with that quote.

| Update | Quote Count |
| --- | :---: |
| `v1.1.7` | 5 |
| `v1.2.5` | 20 |
| `v1.3.1` | 41 | 

## Version 1.0.0 - General Setup
Basic Facility Bot with no functionality. Just introduced shell and related systems operations