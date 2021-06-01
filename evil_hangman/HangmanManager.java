// imports
import java.util.ArrayList;
import java.util.Collections;
import java.util.Set;
import java.util.TreeSet;
import java.util.TreeMap;
import java.util.HashMap;
import java.util.Map;

public class HangmanManager {
    // instance variables
    private ArrayList<String> activeWords;
    private Set<String> guessedLetters;
    private Set<String> wordList;
    private final boolean DEBUG_ON;
    private HangmanDifficulty difficulty;
    private int numGuessesRemaining;
    private String pattern;

    public HangmanManager(Set<String> words, boolean debug) {
        if(words == null || words.isEmpty()) {
            System.err.println("Words cannot be empty or have a NULL reference");
            throw new IllegalArgumentException("Violation of precondtion");
        }

        wordList = words;
        DEBUG_ON = debug;
        guessedLetters = new TreeSet<>();
        activeWords = new ArrayList<>();
    }

    public HangmanManager(Set<String> words) {
        this(words,false);
    }

    public int numWords(int length) {
        if(length < 0) {
            System.err.println("The entered value is not a valid length");
            System.err.println("length: " + length);
            throw new IllegalArgumentException("Violation of precondition");
        }

        var wordCount = 0;
        for(String words: wordList)
            if(words.length() == length)
                wordCount++;
        return wordCount;
    }

    public void prepForRound(int wordlen, int numGuesses, HangmanDifficulty diff) {
        if(numWords(wordlen) == 0) {
            System.err.println("There are no words of the length " + wordlen);
            throw new IllegalArgumentException("Violation of Precondition");
        }
        if(numGuesses < 1) {
            System.err.println("There must be atleast 1 wrong guess before which"
                    + " the player loses a round");
            throw new IllegalArgumentException("Violation of precondition");
        }
        guessedLetters.clear();
        numGuessesRemaining = numGuesses;
        difficulty = diff;
        activeWords.clear();
        for(String word: wordList)
            if(word.length() == wordlen)
                activeWords.add(word);
        var sb = new StringBuilder();
        for(var i = 0; i < wordlen; i++)
            sb.append("-");
        pattern = sb.toString();
    }

    public String debugging(String key, TreeMap<String, Integer> data) {
        int turn = guessedLetters.size();
        var debug = new StringBuilder();
        debug.append("\n");
        if(difficulty == HangmanDifficulty.EASY) {
            if(turn % 2 == 0 && data.size() > 1)
                debug.append("DEBUGGING: Difficulty second hardest pattern and list.\n");
            else if(turn % 2 == 0) {
                debug.append("DEBUGGING: Should pick second hardest pattern this turn,"
                        + " but only one pattern available.\n\n");
                debug.append("DEBUGGING: Picking hardest list.\n");
            } else
                debug.append("DEBUGGING: Picking hardest list.\n");
        } else if(difficulty == HangmanDifficulty.MEDIUM) {
            if(turn % 4 == 0 && data.size() > 1)
                debug.append("DEBUGGING: Difficulty second hardest pattern and list.\n");
            else if(turn % 4 == 0) {
                debug.append("DEBUGGING: Should pick second hardest pattern this turn,"
                        + " but only one pattern available.\n\n");
                debug.append("DEBUGGING: Picking hardest list.\n");
            } else
                debug.append("DEBUGGING: Picking hardest list.\n");
        } else
            debug.append("DEBUGGING: Picking hardest list.\n");
        debug.append("DEBUGGING: New pattern is: " + key + ". ");
        debug.append("New family has " + data.get(key) + " words.");
        return debug.toString();
    }

    public int numWordsCurrent() {
        return activeWords.size();
    }

    public int getGuessesLeft() {
        return numGuessesRemaining;
    }

    public String getGuessesMade() {
        return guessedLetters.toString();
    }

    public boolean alreadyGuessed(char guess) {
        final String GUESS = "" + guess;
        return guessedLetters.contains(GUESS);
    }

    public String getPattern() {
        return pattern;
    }

    public TreeMap<String, Integer> makeGuess(char guess) {
        if(alreadyGuessed(guess))
            throw new IllegalStateException();
        final String GUESS = "" + guess;
        guessedLetters.add(GUESS);
        Map<String, ArrayList<String>> families = new HashMap<>();
        for(String word: activeWords) {
            String currPattern = patternMaker(pattern, word, GUESS);
            families.computeIfAbsent(currPattern, k -> new ArrayList<>()).add(word);
        }
        ArrayList<Patterns> pats = new ArrayList<>();
        for(String key: families.keySet())
            pats.add(new Patterns(key, families.get(key).size()));
        Collections.sort(pats);
        String patternFamily = selectPattern(pats);

        if(pattern.equals(patternFamily))
            numGuessesRemaining--;
        else
            pattern = patternFamily;
        activeWords = families.get(pattern);
        TreeMap<String, Integer> wordsList = new TreeMap<>();
        for(String pat: families.keySet()) {
            int numWordsInFamily = families.get(pat).size();
            wordsList.put(pat, numWordsInFamily);
        }
        if(DEBUG_ON) {
            String statement = debugging(patternFamily, wordsList);
            System.out.println(statement);
        }
        return wordsList;
    }

    private String selectPattern(ArrayList<Patterns> data) {
        if(data == null || data.isEmpty())
            throw new IllegalStateException();
        if(difficulty == HangmanDifficulty.EASY) {
            if(guessedLetters.size() % 2 == 0 && data.size() > 1)
                return data.get(1).getPattern();
            return data.get(0).getPattern();
        }
        if(difficulty == HangmanDifficulty.MEDIUM) {
            if(guessedLetters.size() % 4 == 0 && data.size() > 1)
                return data.get(1).getPattern();
            return data.get(0).getPattern();
        }
        return data.get(0).getPattern();
    }

    public static class Patterns implements Comparable<Patterns> {
        // instance variables
        private String pattern;
        private int numWords;

        public Patterns(String pattern, int numWords) {
            this.pattern = pattern;
            this.numWords = numWords;
        }

        public String getPattern() {
            return pattern;
        }

        public int getNumWords() {
            return numWords;
        }

        public int compareTo(Patterns otherPattern) {
            if(otherPattern == null)
                throw new IllegalArgumentException("Object being compared cannot be null");
            int thisUnknowns = countUnknowns(this.pattern);
            int otherUnknowns = countUnknowns(otherPattern.pattern);
            boolean sameNumWords = this.numWords == otherPattern.numWords;
            boolean sameCount = thisUnknowns == otherUnknowns;
            if(sameNumWords && sameCount)
                return this.pattern.compareTo(otherPattern.pattern);
            if(sameNumWords)
                return otherUnknowns - thisUnknowns;
            return otherPattern.numWords - this.numWords;
        }

        private int countUnknowns(String pattern) {
            final var UNKNOWN = '-';
            var count = 0;
            for(var i = 0; i < pattern.length(); i++)
                count += pattern.charAt(i) == UNKNOWN ? 1 : 0;
            return count;
        }

    }

    private String patternMaker(String basePattern, String targetWord, String guess) {
        if(basePattern.length() != targetWord.length() || guess.length() != 1)
            throw new IllegalStateException();
        var patBuild = new StringBuilder();
        patBuild.append(basePattern);
        for(var i = 0; i < targetWord.length(); i++)
            if(targetWord.substring(i, i + 1).equals(guess))
                patBuild.replace(i, i + 1, guess);
        return patBuild.toString();
    }

    public String getSecretWord() {
        if(numWordsCurrent() == 0)
            throw new IllegalStateException();
        if(numWordsCurrent() == 1)
            return activeWords.get(0);
        int randIndex = (int) (Math.random() * activeWords.size());
        return activeWords.get(randIndex);
    }
}
