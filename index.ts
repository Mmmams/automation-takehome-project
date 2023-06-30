const fs = require('fs')

import {Browser, BrowserContext, chromium, Page} from '@playwright/test'
import {createObjectCsvWriter} from 'csv-writer'

import {csvHeader, IItem, ISearchOn} from "./interfaces/interfaces"
import amazonConfig from "./configs/amazon.json"


export async function search(config: ISearchOn): Promise<IItem[]> {
    const browser: Browser = await chromium.launch()
    const context: BrowserContext = await browser.newContext()
    const page: Page = await context.newPage()
    if (!page) {
        throw new Error("Page wasn't found")
    }
    await page.goto(config.url)
    await page.fill(config.searchInputSelector, config.searchTerm)
    await page.click(config.searchButtonSelector)
    await page.waitForSelector(config.dropdownSelector)
    await page.click(config.dropdownSelector)
    await page.click(config.filterBySelector)
    await page.waitForSelector(config.listOfItemsSelector)

    const results: IItem[] = await page.evaluate((config) => {
        const items: Element[] = Array.from(document.querySelectorAll(config.listOfItemsSelector))
        const elements: IItem[] = []

        items.forEach((item) => {
            const titleElement: Element | null = item.querySelector(config.valuesSelector.title)
            const linkElement: Element | null = item.querySelector(config.valuesSelector.link)
            const priceElement: Element | null = item.querySelector(config.valuesSelector.price)
            if (titleElement?.textContent && priceElement?.textContent && linkElement?.getAttribute('href')) {
                elements.push({
                    searchTerm: config.searchTerm,
                    product: titleElement?.textContent || '',
                    price: priceElement?.textContent || '',
                    link: `${config.url}${linkElement?.getAttribute('href')}` || ''
                })
            }
        })

        return elements.slice(0, config.numberOfItems)
    }, config)

    await browser.close()
    return results
}


export function getFileName(): string {
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    const month: number = currentDate.getMonth() + 1
    const day: number = currentDate.getDate()
    return `${year}-${month}-${day}.csv`
}


export async function writeCSV(data: IItem[], pathToFolder?: string) {
    const path: string = pathToFolder || './csv/'
    const isFolderExist = fs.existsSync(`${path}`)
    if (!isFolderExist) {
        fs.mkdirSync(path)
    }
    const fileName = getFileName()
    const isFileExist = fs.existsSync(`${path}${fileName}`)
    if (!isFileExist) {
        fs.writeFile(`${path}${fileName}`, '', (err: unknown) => {
            if (err) {
                console.error('Error occurred:', err)
            } else {
                console.log('CSV file created successfully.')
            }
        })
    }
    const csvWriter = createObjectCsvWriter({
        path: `${path}${fileName}`,
        header: csvHeader,
        append: isFileExist
    })

    await csvWriter.writeRecords(data)
}

search(amazonConfig)
    .then((results) => {
        writeCSV(results)
    }).then(() => {
    console.log('Items was added in CSV file!')
})
    .catch((error) => {
        console.error('Error occurred:', error)
    })