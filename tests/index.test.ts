const fs = require('fs')

import {IItem} from "../interfaces/interfaces"
import {expect, test} from '@playwright/test'

import {getFileName, search, writeCSV} from "../index"
import amazonConfig from "../configs/amazon.json"


test('Search on Amazon: length of items is correct', async () => {
    const result = await search(amazonConfig)
    expect(result.length).toBe(amazonConfig.numberOfItems)
})

test('Search on Amazon', async () => {
    const result = await search(amazonConfig)

    for (const item of result) {
        expect(item).toHaveProperty('searchTerm')
        expect(item).toHaveProperty('product')
        expect(item).toHaveProperty('price')
        expect(item).toHaveProperty('link')
        expect(item.searchTerm).not.toBeNull()
        expect(item.product).not.toBeNull()
        expect(item.price).not.toBeNull()
        expect(item.link).not.toBeNull()
    }
})

test('Get name', async () => {
    const name: string = await getFileName()
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    const month: number = currentDate.getMonth() + 1
    const day: number = currentDate.getDate()
    const fileName = `${year}-${month}-${day}.csv`
    expect(name).toEqual(fileName)
})

test('Create file', async () => {
    const data: IItem[] = [
        {
            searchTerm: 'Test search term',
            product: 'Test product',
            price: '1$',
            link: 'https://test.com'
        },
        {
            searchTerm: 'Test search term',
            product: 'Test product',
            price: '1$',
            link: 'https://test.com'
        }
    ]
    const name: string = await getFileName()
    await writeCSV(data, './tests/testCsv/')
    const fileExist = fs.existsSync(`./tests/testCsv/${name}`)
    expect(fileExist).toBe(true)
})
