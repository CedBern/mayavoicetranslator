/**
 * @file LinguisticToolkitService.js
 * Provides various linguistic processing tools for Mayan languages.
 * Currently includes a Yucatec Maya tokenizer.
 */

/**
 * Tokenizes Yucatec Maya text according to specific linguistic rules.
 * This function is designed to handle the nuances of Yucatec Maya orthography,
 * including glottal stops (saltillos), clitics, and standard punctuation.
 *
 * @param {string} text The input string in Yucatec Maya to be tokenized.
 * @returns {string[]} An array of tokens.
 *
 * @example
 * const tokens = tokenizeYucatec("Bejlaʼeʼ, kin bin xook.");
 * // -> ["Bejlaʼeʼ", ",", "kin", "bin", "xook", "."]
 *
 * Features handled:
 * - Saltillo (glottal stop ʼ U+02BC) remains attached to preceding word
 * - Punctuation is separated: , . ; : ? ! « » ( )
 * - Clitics are split using = as separator
 * - Multiple spaces are collapsed (no empty tokens)
 */
function tokenizeYucatec(text) {
    if (!text) return [];

    // Normalize spaces and trim
    let processedText = text.trim().replace(/\s+/g, ' ');

    // Add spaces around punctuation and clitic separators for easier splitting
    // Handles punctuation: , . ; : ? ! « » ( )
    // Handles clitic separator: =
    processedText = processedText.replace(/([.,;:?!«»()=])/g, ' $1 ');

    // Collapse multiple spaces that might have been created
    processedText = processedText.replace(/\s+/g, ' ');

    // Split by space
    const tokens = processedText.split(' ');

    // Filter out any empty tokens that might remain after splitting
    return tokens.filter(token => token.length > 0);
}


/**
 * Runs a series of tests to validate the tokenizeYucatec function.
 */
function runTokenizerTests() {
    console.log("Running Yucatec tokenizer tests...");

    const testCases = [
        {
            input: "Le chan paaloʼob túun táan u báaxal.",
            expected: ["Le", "chan", "paaloʼob", "túun", "táan", "u", "báaxal", "."]
        },
        {
            input: "Maʼalob, kin bin.",
            expected: ["Maʼalob", ",", "kin", "bin", "."]
        },
        {
            input: "kʼiin",
            expected: ["kʼiin"]
        },
        {
            input: "in naj=oʼob",
            expected: ["in", "naj", "=", "oʼob"]
        },
        {
            input: "  kʼiin   le   ",
            expected: ["kʼiin", "le"]
        },
        {
            input: "Bejlaʼeʼ, «Maʼalob!» (kʼiin)",
            expected: ["Bejlaʼeʼ", ",", "«", "Maʼalob", "!", "»", "(", "kʼiin", ")"]
        },
        {
            input: "",
            expected: []
        },
        {
            input: "Bix a beel?",
            expected: ["Bix", "a", "beel", "?"]
        },
        {
            input: "Janal=be'en.",
            expected: ["Janal", "=", "be'en", "."]
        }
    ];

    let allPassed = true;
    testCases.forEach((test, index) => {
        const result = tokenizeYucatec(test.input);
        const passed = JSON.stringify(result) === JSON.stringify(test.expected);
        if (!passed) {
            console.error(`Test ${index + 1} failed!`);
            console.error(`  Input:    "${test.input}"`);
            console.error(`  Expected: ${JSON.stringify(test.expected)}`);
            console.error(`  Got:      ${JSON.stringify(result)}`);
            allPassed = false;
        }
    });

    if (allPassed) {
        console.log("All Yucatec tokenizer tests passed!");
    } else {
        console.error("Some Yucatec tokenizer tests failed.");
    }
    return allPassed;
}


export {
    runTokenizerTests, tokenizeYucatec
};

