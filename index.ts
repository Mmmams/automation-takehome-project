import {Browser, chromium, Page} from '@playwright/test'
import {IItem, ISearchOn} from "./interfaces/interfaces";
import {searchOnAmazonConfig} from "./config";

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

    const results: IItem[] = await page.$$eval(
        config.listOfItemsSelector,
        (items: Element[]) => {
            const elements: IItem[] = [];
            items.forEach((item) => {
                const titleElement = item.querySelector(config.valuesSelector.title);
                const link = item.querySelector(config.valuesSelector.link)
                const price = item.querySelector(config.valuesSelector.price)
                if (titleElement) {
                    elements.push({
                        searchTerm: config.searchTerm,
                        title: titleElement.textContent || '',
                        price: price.textContent || '',
                        link: link.getAttribute('href') || ''
                    });
                }
            })
            return elements;
        }
    );

    await browser.close();
    return results;
}

searchOn(searchOnAmazonConfig)
    .then((results) => {
        console.log(results);
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });