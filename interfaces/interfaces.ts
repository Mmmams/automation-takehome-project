export interface ISearchOn {
    searchTerm: string,
    numberOfItems: number
    url: string,
    searchInputSelector: string,
    searchButtonSelector: string,
    dropdownSelector: string,
    filterBySelector: string,
    listOfItemsSelector: string,
    valuesSelector: {
        title: string,
        link: string,
        price: string
    }
}

export interface IItem {
    searchTerm: string,
    product: string,
    price: string,
    link: string
}

export const csvHeader = [
    {id: 'searchTerm', title: 'Search Term'},
    {id: 'product', title: 'Product'},
    {id: 'price', title: 'Price'},
    {id: 'link', title: 'Link'},
]