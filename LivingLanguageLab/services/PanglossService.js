import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

class PanglossService {
    constructor() {
        this.baseUrl = 'https://pangloss.cnrs.fr';
        this.parser = new xml2js.Parser();
    }

    async getAllLanguages() {
        try {
            const url = `${this.baseUrl}/corpus/`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const languages = {};

            // More precise selector targeting the language list table
            $('div.table-responsive tbody tr').each((i, row) => {
                const firstTd = $(row).find('td').first();
                const link = firstTd.find('a');
                
                const langName = link.text().trim();
                const langPath = link.attr('href');

                // Ensure it's a valid language link
                if (langName && langPath && langPath.startsWith('/corpus/') && langPath.length > '/corpus/'.length) {
                    // Check if the link is not a country link (which are also in the first column)
                    // A simple heuristic: country names are often followed by a number in parentheses.
                    // A better check might be needed if this is not reliable.
                    // For now, we assume any link in that column is a language.
                    languages[langName] = `${this.baseUrl}${langPath}`;
                }
            });

            return languages;
        } catch (error) {
            console.error(`Error fetching language list:`, error);
            return {};
        }
    }


    async getCorpusListForLanguage(languageUrl) {
        try {
            // The languageUrl is now the full URL to the language page
            const response = await axios.get(languageUrl);
            const $ = cheerio.load(response.data);
            const corpusIds = [];

            // Find links that point to corpus resources
            $('a').each((i, link) => {
                const href = $(link).attr('href');
                // The links to corpora seem to follow this pattern
                if (href && href.includes('/show_rsc.php?id=')) {
                    // Extract the corpus ID from the href
                    const corpusId = href.split('id=')[1].split('&')[0];
                    corpusIds.push(corpusId);
                }
            });

            // Return unique IDs
            return [...new Set(corpusIds)];
        } catch (error) {
            console.error(`Error fetching corpus list for ${languageUrl}:`, error);
            return [];
        }
    }

    async fetchAndProcessCorpus(corpusId) {
        try {
            // Note: The URL structure might need to be adjusted based on how to access the raw XML.
            // This is a placeholder assuming a direct XML link can be constructed.
            const url = `${this.baseUrl}/corpus/show_rsc_xml.php?id=${corpusId}`;
            const response = await axios.get(url, { responseType: 'text' });
            const parsedData = await this.parser.parseStringPromise(response.data);
            
            const outputPath = path.join(__dirname, '..\..\..\data\pangloss', `${corpusId}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2));

            return { success: true, data: parsedData };
        } catch (error) {
            console.error(`Error fetching or processing Pangloss corpus ${corpusId}:`, error);
            return { success: false, error: error.message };
        }
    }
}

export default new PanglossService();
