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
    title: string,
    price: string,
    link: string
}