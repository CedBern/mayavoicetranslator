
import sys
import json
import stanza

# =================================================================================================
# Stanza NLP Pipeline (Python Script)
# =================================================================================================
#
# This script provides a Python-based NLP processing pipeline using the Stanza library.
# It is designed to be called from a Node.js environment (e.g., using python-shell)
# to perform advanced linguistic analysis on text.
#
# Functionality:
# 1.  **Initialization:** Downloads and initializes a Stanza pipeline for a specified language.
#     Stanza's models are language-specific and provide tokenization, multi-word token
#     expansion, lemmatization, part-of-speech (POS) tagging, morphological analysis,
#     and dependency parsing.
#
# 2.  **Input/Output:**
#     -   Receives input text and language code via standard input (stdin).
#     -   Processes the text through the Stanza pipeline.
#     -   Outputs the full annotated document as a JSON string to standard output (stdout).
#
# 3.  **Error Handling:** Catches exceptions during pipeline initialization or processing
#     and prints an error message to stderr, which can be captured by the calling Node.js process.
#
# Integration with Node.js:
# -   The `python-shell` library in Node.js is used to run this script as a child process.
# -   Node.js sends the text and language configuration to the script.
# -   The script returns the structured linguistic data, which can then be used by services
#     like `LinguisticAnalysisService.js` to enrich the application's understanding of text.
#
# Example Usage (from command line):
#   echo '{"lang": "yua", "text": "Bix a beel?"}' | python nlp_scripts/stanza_analyzer.py
#
# =================================================================================================

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
        lang = input_data.get('lang')
        text = input_data.get('text')

        if not lang or not text:
            raise ValueError("Missing 'lang' or 'text' in input JSON.")

        # Stanza does not have pre-trained models for most Mayan languages.
        # We use a placeholder or a model for a related, more-resourced language if available.
        # For this example, we'll use a multilingual model or Spanish ('es') as a stand-in
        # to demonstrate the pipeline's functionality. The real implementation would require
        # training custom models.
        #
        # NOTE: Stanza requires the language code in ISO 639-1 format.
        # We need a mapping from our internal codes (e.g., 'yua') to what Stanza expects.
        lang_map = {
            'yua': 'es', # Placeholder: Yucatec Maya -> Spanish model
            'quc': 'es', # Placeholder: K'iche' -> Spanish model
            'es': 'es',
            'fr': 'fr',
            'en': 'en'
        }
        stanza_lang = lang_map.get(lang, 'es') # Default to Spanish

        # Download and initialize the Stanza pipeline
        # This will download the model on the first run for the language.
        stanza.download(stanza_lang, verbose=False)
        nlp = stanza.Pipeline(stanza_lang, verbose=False)

        # Process the text
        doc = nlp(text)

        # Convert the processed document to a dictionary and print as JSON
        # This captures sentences, tokens, lemmas, POS, morphology, and dependencies.
        output_dict = doc.to_dict()

        print(json.dumps(output_dict, indent=2))

    except Exception as e:
        # Print error to stderr for the Node.js process to catch
        print(f"Error in Stanza script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
