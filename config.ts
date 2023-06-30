import {ISearchOn} from "./interfaces/interfaces";

export const searchOnAmazonConfig: ISearchOn = {
    searchTerm: 'macbook',
    numberOfItems: 5,
    url: 'https://www.amazon.com/',
    searchInputSelector: '#twotabsearchtextbox',
    searchButtonSelector: '.nav-search-submit .nav-input',
    dropdownSelector: '.a-dropdown-container .a-button-inner',
    filterBySelector: '#s-result-sort-select_1',
    listOfItemsSelector: '.s-result-list .s-result-item',
    valuesSelector: {
        title: '.a-link-normal .a-text-normal',
        link: '.sg-row .a-link-normal',
        price: '.a-price .a-offscreen'
    }
}