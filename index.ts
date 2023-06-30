import { chromium, Browser, Page } from '@playwright/test';

async function searchOnAmazon(): Promise<string[]> {
    const browser: Browser = await chromium.launch();
    const context = await browser.newContext();
    const page: Page = await context.newPage();
    await page.goto('https://www.amazon.com/');
    await page.fill('#twotabsearchtextbox', 'macbook pro');
    await page.click('.nav-search-submit .nav-input');
    await page.click('.a-dropdown-container .a-button-inner');
    await page.click('#s-result-sort-select_1');
    await page.waitForFunction(() => {
        const items = Array.from(document.querySelectorAll('.s-result-list .s-result-item'));
        return items.length >= 3;
    });

    const results: string[] = await page.$$eval(
        '.s-result-list .s-result-item',
        (items: Element[]) => {
            const elements: any[] = [];
                items.forEach((item) => {
                    const titleElement = item.querySelector('.a-link-normal .a-text-normal');
                    const link = item.querySelector('.sg-row .a-link-normal ')
                    const price = item.querySelector('.a-price .a-offscreen')
                    if (titleElement) {
                        elements.push({
                            title: titleElement.textContent || '',
                            price: price.textContent || '',
                            link: link.getAttribute('href') ||''
                        });
                    }
                })
            return elements;
        }
    );

    await browser.close();
    return results;
}

searchOnAmazon()
    .then((results) => {
        console.log(results);
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });