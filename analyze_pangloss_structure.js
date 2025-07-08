import PanglossService from './LivingLanguageLab/services/PanglossService.js';

(async () => {
    try {
        console.log('Fetching all available languages from Pangloss...');
        const languages = await PanglossService.getAllLanguages();
        const languageNames = Object.keys(languages);

        if (languageNames.length > 0) {
            console.log(`Found ${languageNames.length} languages.`);
            
            // Example: Use Yucatec Maya, but check if it exists first
            const targetLangName = 'Yucatec Maya';
            const languageUrl = languages[targetLangName];

            if (languageUrl) {
                console.log(`Fetching corpus list for language: ${targetLangName}`);
                const corpusIds = await PanglossService.getCorpusListForLanguage(languageUrl);

                if (corpusIds && corpusIds.length > 0) {
                    console.log(`Found ${corpusIds.length} corpora. Processing the first one: ${corpusIds[0]}`);
                    const result = await PanglossService.fetchAndProcessCorpus(corpusIds[0]);
                    if (result.success) {
                        console.log('Successfully fetched and processed corpus. Check the data/pangloss directory.');
                    } else {
                        console.error('Failed to process corpus:', result.error);
                    }
                } else {
                    console.log(`No corpora found for ${targetLangName}.`);
                }
            } else {
                console.log(`Language "${targetLangName}" not found in the list. Available languages are:`);
                console.log(languageNames.join(', '));
            }
        } else {
            console.log('No languages found on Pangloss.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
