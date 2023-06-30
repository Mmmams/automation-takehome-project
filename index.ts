import {Browser, chromium, Page} from '@playwright/test'
import {createObjectCsvWriter} from 'csv-writer';
import {csvHeader, IItem, ISearchOn} from "./interfaces/interfaces";
import {searchOnAmazonConfig} from "./config";

const fs = require('fs');


async function searchOn(config: ISearchOn): Promise<IItem[]> {
    const browser: Browser = await chromium.launch();
    const context = await browser.newContext();
    const page: Page = await context.newPage();
    await page.goto(config.url);
    await page.fill(config.searchInputSelector, config.searchTerm);
    await page.click(config.searchButtonSelector);
    await page.waitForSelector(config.dropdownSelector)
    await page.click(config.dropdownSelector);
    await page.click(config.filterBySelector)
    await page.waitForSelector(config.listOfItemsSelector)

    const results: IItem[] = await page.evaluate((config) => {
        const items = Array.from(document.querySelectorAll(config.listOfItemsSelector));
        const elements: IItem[] = [];

        items.slice(0, config.numberOfItems).forEach((item) => {
            const titleElement = item.querySelector(config.valuesSelector.title);
            const linkElement = item.querySelector(config.valuesSelector.link);
            const priceElement = item.querySelector(config.valuesSelector.price);
            if (titleElement?.textContent && priceElement?.textContent && linkElement?.getAttribute('href')) {
                elements.push({
                    searchTerm: config.searchTerm,
                    product: titleElement?.textContent || '',
                    price: priceElement?.textContent || '',
                    link: linkElement?.getAttribute('href') || ''
                });
            }
        });

        return elements;
    }, config);

    await browser.close();
    return results;
}

function writeCSV(data) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const fileName = `${year}-${month}-${day}.csv`
    if (!fs.existsSync(`./searchResults/${fileName}.csv`)) {
        fs.writeFile(`./searchResults/${fileName}`, '', (err) => {
            if (err) {
                console.error('An error occurred:', err);
            } else {
                console.log('CSV file created successfully.');
            }
        });
    }
    const csvWriter = createObjectCsvWriter({
        path: `./searchResults/${fileName}`,
        header: csvHeader,
    });
    csvWriter.writeRecords(data)
}

searchOn(searchOnAmazonConfig)
    .then((results) => {
        console.log(results)
        writeCSV(results)
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });