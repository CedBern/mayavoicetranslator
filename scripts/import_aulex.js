// scripts/import_aulex.js
import fs from 'fs/promises';
import path from 'path';

const AULEX_TXT_PATH = path.resolve(process.cwd(), 'data', 'aulex', 'es-myn.txt');
const AULEX_JSON_PATH = path.resolve(process.cwd(), 'data', 'aulex', 'es-myn.json');

async function parseAulex() {
    try {
        console.log(`Reading Aulex dictionary from: ${AULEX_TXT_PATH}`);
        const fileContent = await fs.readFile(AULEX_TXT_PATH, 'utf-8');
        const lines = fileContent.split(/\r?\n/);

        const dictionary = {};

        for (const line of lines) {
            if (!line.trim()) continue;

            const parts = line.split(' : ');
            if (parts.length < 2) {
                console.warn(`Skipping malformed line: ${line}`);
                continue;
            }

            const spanishPart = parts[0].trim();
            const mayanPart = parts.slice(1).join(' : ').trim();

            let spanishWord = spanishPart;
            let clarification = null;

            const clarificationMatch = spanishPart.match(/\((.*?)\)/);
            if (clarificationMatch) {
                spanishWord = spanishPart.replace(clarificationMatch[0], '').trim();
                clarification = clarificationMatch[1];
            }

            if (!dictionary[spanishWord]) {
                dictionary[spanishWord] = [];
            }

            const entry = {
                mayan: mayanPart
            };

            if (clarification) {
                entry.clarification = clarification;
            }

            dictionary[spanishWord].push(entry);
        }

        console.log(`Parsed ${Object.keys(dictionary).length} unique Spanish words.`);
        console.log(`Writing parsed dictionary to: ${AULEX_JSON_PATH}`);

        await fs.writeFile(AULEX_JSON_PATH, JSON.stringify(dictionary, null, 2));

        console.log('Aulex dictionary imported successfully!');

    } catch (error) {
        console.error('Error importing Aulex dictionary:', error);
    }
}

parseAulex();
