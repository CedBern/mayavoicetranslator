// Service Node.js pour récupérer des traductions et exemples WordReference (usage interne)
// Utilisable côté backend pour alimenter le web et l'API mobile

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

/**
 * Scrape WordReference pour un mot donné (français → anglais par défaut)
 * @param {string} mot - Mot à traduire
 * @param {string} from - Langue source (ex: 'fr')
 * @param {string} to - Langue cible (ex: 'en')
 * @returns {Promise<Array>} Liste de traductions et exemples
 */
async function scrapeWordReference(mot, from = 'fr', to = 'en') {
    const url = `https://www.wordreference.com/${from}${to}/${encodeURIComponent(mot)}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const content = await page.content();
    const $ = cheerio.load(content);
    const translations = [];
    $('tr.even, tr.odd').each((i, elem) => {
        const cols = $(elem).find('td');
        if (cols.length >= 2) {
            const source = $(cols[0]).text().trim();
            const target = $(cols[1]).text().trim();
            const example = $(cols[3]).text().trim(); // Exemples contextuels si présents
            if (source && target) {
                translations.push({ source, target, example });
            }
        }
    });
    await browser.close();
    return translations;
}

module.exports = { scrapeWordReference };
