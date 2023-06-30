import {expect, test} from '@playwright/test';
import {IItem} from "../interfaces/interfaces";
import {searchOnAmazonConfig as config} from "../config";

test('main', async ({page}) => {
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

    console.log(results)
    await expect(results).toHaveLength(3)
});