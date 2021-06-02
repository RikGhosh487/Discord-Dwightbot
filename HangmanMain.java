import java.io.File;
import java.io.FileNotFoundException;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.Collections;
import java.util.Scanner;

public class HangmanMain {
    private static final String DICTIONARY_FILE = "./dictionary.txt";
    private static final boolean DEBUG = false;
    private static final int MAX_GUESSES = 25;
    private static final String NEWLINE = System.getProperty("line.separator");

    public static void main(String[] args) {
        System.out.println("Welcome to the CS314 Hangman Game");
        System.out.println(NEWLINE);

        Set<String> dictionary = getDictionary();
        var hangman = new HangmanManager(dictionary, DEBUG);
        if(DEBUG)
            showWordCounts(hangman);
        
        var keyboard = new Scanner(System.in);
        do{
            setGameParams(hangman, keyboard);
            playGame(keyboard, hangman);
            showResults(hangman);
        } while(playAgain(keyboard));
        keyboard.close();
    }

    private static boolean playAgain(Scanner keyboard) {
        System.out.println(NEWLINE);
        System.out.print("Another Game? Enter y for another game, anything else to quit: ");
        String answer = keyboard.nextLine();
        return answer.length() > 0 && answer.toLowerCase().charAt(0) == 'y';
    }

    private static void setGameParams(HangmanManager hangman, Scanner keyboard) {
        var wordLength = 0;
        do{
            System.out.print("What length word do you want to use? ");
            wordLength = Integer.parseInt(keyboard.nextLine());
        } while(!atLeastOneWord(hangman, wordLength));
        var numGuesses = 0;
        do{
            System.out.print("How many wrong answers allowed? ");
            numGuesses = Integer.parseInt(keyboard.nextLine());
        } while(!validChoice(numGuesses, 1, MAX_GUESSES, "number of wrong guesses"));
        HangmanDifficulty difficulty = getDifficulty(keyboard);
        hangman.prepForRound(wordLength, numGuesses, difficulty);
    }

    private static HangmanDifficulty getDifficulty(Scanner keyboard) {
        int diffChoice = HangmanDifficulty.EASY.ordinal();
        do{
            System.out.println("What difficulty level would you want?");
            System.out.print("Enter a number between " + HangmanDifficulty.minPossible() 
                    + " (EASIEST) and " + HangmanDifficulty.maxPossible() + " (HARDEST): ");
            diffChoice = Integer.parseInt(keyboard.nextLine());
        } while(!validChoice(diffChoice, HangmanDifficulty.minPossible(),
                HangmanDifficulty.maxPossible(), "difficulty"));
        return HangmanDifficulty.values()[diffChoice - 1];
    }

    private static boolean validChoice(int choice, int min, int max, String explanation) {
        boolean valid = (min <= choice) && (choice <= max);
        if(!valid) {
            System.out.println(choice + " is not a valid number for " + explanation);
            System.out.println("Pick a number between " + min + " and " + max);
        }
        return valid;
    }

    private static boolean atLeastOneWord(HangmanManager hangman, int wordLength) {
        int numWords = hangman.numWords(wordLength);
        if(numWords == 0) {
            System.out.println(NEWLINE);
            System.out.println("I don't know any words with " + wordLength + " letters. Enter another number.");
        }
        return numWords != 0;
    }

    private static Set<String> getDictionary() {
        Set<String> dictionary = new TreeSet<>();
        try {
            var input = new Scanner(new File(DICTIONARY_FILE));
            while(input.hasNext())
                dictionary.add(input.next().toLowerCase());
            input.close();
        } catch(FileNotFoundException e) {
            e.printStackTrace();
            System.err.println("Unable to find this file: " + DICTIONARY_FILE);
            System.err.print("Program running in this directory: ");
            System.err.println(System.getProperty("user.dir"));
            System.err.println("Be sure the dictionary file is in that directory");
            System.err.println("Exiting");
            System.exit(-1);
        }
        return Collections.unmodifiableSet(dictionary);
    }

    private static void playGame(Scanner keyboard, HangmanManager hangman) {
        final String UNKNOWN = "-";
        while(hangman.getGuessesLeft() > 0 && hangman.getPattern().contains(UNKNOWN)) {
            System.out.println("Guesses left: " + hangman.getGuessesLeft());
            if(DEBUG)
                System.out.println("DEBUGGING: words left: " + hangman.numWordsCurrent());
            System.out.println("guessed so far: " + hangman.getGuessesMade());
            System.out.println("current word: " + hangman.getPattern());
            char guess = getLetter(keyboard, hangman);
            TreeMap<String, Integer> results = hangman.makeGuess(guess);
            if(DEBUG)
                showPatterns(results);
            showResultOfGuess(hangman, guess);
        }
    }

    private static void showResultOfGuess(HangmanManager hangman, char guess) {
        int count = getCount(hangman.getPattern(), guess);
        if(count == 0)
            System.out.println("Sorry, there are no " + guess + "'s" );
        else if (count == 1)
            System.out.println("Yes, there is one " + guess);
        else
            System.out.println("Yes, there are " + count + " " + guess + "'s");
        System.out.println(NEWLINE);
    }

    private static char getLetter(Scanner keyboard, HangmanManager manager) {
        if(keyboard == null || manager == null)
            throw new IllegalArgumentException("Parameters to method may not be null");
        var alreadyGuessed = true;
        var guess = ' ';
        while(alreadyGuessed) {
            System.out.println("Your Guess? ");
            String result = keyboard.nextLine().toLowerCase();
            while(result == null || result.length() == 0 || !isEnglishLetter(result.charAt(0))) {
                System.out.println("This is not an English Letter.");
                System.out.println("Your Guess? ");
                result = keyboard.nextLine().toLowerCase();
            }
            guess = result.charAt(0);
            alreadyGuessed = manager.alreadyGuessed(guess);
            if(alreadyGuessed)
                System.out.println("You already guessed that! Pick a new letter.");
        }
        System.out.println("the guess: " + guess + ".");
        assert isEnglishLetter(guess) && !manager.alreadyGuessed(guess) : "something wrong with logic" + guess;
        return guess;
    }

    private static boolean isEnglishLetter(char ch) {
        return ('A' <= ch && ch <= 'Z') || ('a' <= ch && ch <= 'z');
    }

    private static void showPatterns(TreeMap<String, Integer> results) {
        if(results == null)
            throw new IllegalArgumentException("Map cannot be null");
        System.out.println(NEWLINE);
        System.out.println("DEBUGGING: Based on guess here are resulting patterns and number");
        System.out.println("of words in each pattern:");
        for(String key: results.keySet())
            System.out.println("pattern: " + key + ", number of words: " + results.get(key));
        System.out.println("END DEBUGGING");
        System.out.println(NEWLINE);
    }

    private static int getCount(String pattern, char guess) {
        if(pattern == null)
            throw new IllegalArgumentException("Pattern may not be null");
        var result = 0;
        for(var i = 0; i < pattern.length(); i++)
            result += pattern.charAt(i) == guess ? 1 : 0;
        return result;
    }

    private static void showResults(HangmanManager hangman) {
        String answer = hangman.getSecretWord();
        System.out.println("answer = " + answer);
        if(hangman.getGuessesLeft() > 0)
            System.out.println("You beat me");
        else
            System.out.println("Sorry, you lose");
    }

    private static void showWordCounts(HangmanManager hangman) {
        final var MAX_LETTERS = 25;
        for(var i = 0; i < MAX_LETTERS; i++) {
            System.out.println(i + " " + hangman.numWords(i));
        }
    }
}
