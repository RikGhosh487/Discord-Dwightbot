/**
 * This enumerated type represents the difficulty levels for 
 * Evil Hangman.
 * 
 * EASY alternates between the hardest word and the second hardest word.
 * MEDIUM picks the hardest word for three rounds, then the second hardest word,
 * then the hardest word for three rounds, then the second hardest word, and so forth.
 * HARD always picks the hardest word.
 * @author R. Ghosh
 *
 */
public enum HangmanDifficulty {
    EASY, MEDIUM, HARD;

    /**
     * Get the lowest possible int (ordinal value) for this enum using 1-based
     * indexing.
     * @param void
     * @author Rik Ghosh
     * @version 1.0.0
     * @return the lowest possible ordinal for this enum using 1-based indexing.
     */
    public static int minPossible() {
        return EASY.ordinal() + 1;
    }

    /**
     * Get the highest possible int (ordinal value) for this enum using 1-based
     * indexing.
     * @param void
     * @author Rik Ghosh
     * @version 1.0.0
     * @return the highest possible ordinal for this enum using 1-based indexing.
     */
    public static int maxPossible() {
        return HARD.ordinal() + 1;
    }
}