# Dwightbot
## General Description
Simple Discord bot themed with Dwight K. Shrute with multi-facated functionality

### Current Bugs (as of v 1.4.2)
- duplication of replies from the bot with `?hangman` command and all subsequent messages from the bot
- looping pattern with same reply posted with multi-threading

## Version 1.4.2 - Hangman User Input Introductory Patch
Introduced a looping request feeder for the bot that asks for a input length for the size of the word the user wants to pick for his/her hangman game.

## Version 1.4.1 - Hangman Shell Update
Introduced the basic shell of the 4th functionality for discord bot.
Typing `?hangman` will launch a new playable environment where the user would be able to play hangman in the future. There are plent of bugs and issues with this shell and the code (originally written in **Java** and then reimplemented using **Javascript**) is not fully portable for Discord requirements. Currently includes `?quit` command as well, allowing the user to leave the playable environment. This will feature only single player environments so multiple threads of the hangman interface cannot be generated. The bot will prevent another user from joining if someone is already playing Hangman

## Version 1.3.1 - Music Update
Introduced third functionality for discord bot.
Typing `?theme` or `?play` or `?play theme` while in a Voice Channel will make the bot play a random song that was featured in an episode of [The Office](https://www.peacocktv.com/stream-tv/the-office). After the song is finished, the bot shall automatically leave the Voice Channel and send a reply to notify the user that the song is over. There is not `?skip` or `?leave` command. Potential snarky reply feature may be introduced in the future.

Current List of Available Songs:
- 9,986,000 Minutes
- Best Intro Ever
- Electric City
- In The Jungle
- Male Prima Donna
- Rockin Robin Theme
- Sweeney Todd
- That One Night
- The Office Main Theme
- The Scarn
- The Wedding Theme
- Threat Level Midnight
- What I Hate About You

**DISCLAIMER** - Contains the original audio clips from NBC's [The Office](https://www.peacocktv.com/stream-tv/the-office). If intending to play these themes while you are streaming on a platform ([YouTube](https://www.youtube.com), [Twitch](https://www.twitch.tv/), or others), please refrain from playing these tracks as you can be subject to **COPYRIGHT ISSUES**.

## Version 1.2.8 - Domination Update
Special user specific functionality added to discord bot.
Continuously monitors the chats to detetch any messages from selected list of server members and **silently** deletes their messages without sending any indication or reply. This domination feature needs to be manually swithced **ON** or **OFF** via hardcoding the flag in `index.js`.

| Update | User Count | Username |
| :--- | :---: | :---: |
| `v1.2.8` | 1 | `@Mister_Noob_Killer` |

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
| `v1.4.2` | 42 | 

## Version 1.0.0 - General Setup
Basic Facility Bot with no functionality. Just introduced shell and related systems operations