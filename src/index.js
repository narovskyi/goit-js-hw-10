import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const onSearchBoxInputDebounced = debounce(
    onSearchBoxInput,
    DEBOUNCE_DELAY,
    {
        'trailing': true
    }
);
let inputValue = '';


const refs = {
    searchBoxInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
}

refs.searchBoxInput.addEventListener('input', onSearchBoxInputDebounced);

function onSearchBoxInput() {
    inputValue = refs.searchBoxInput.value.trim();
    if (inputValue === '') {
        clearSpace();
        return;
    }
    fetchCountries(inputValue)
        .then(res => {
            if (res.length > 10) {
                clearSpace();
                Notify.info("Too many matches found. Please enter a more specific name.");
            } else if (res.length <= 10 && res.length >= 2) {
                renderCountriesList(res);
            } else if (res.length === 0) {
                clearSpace();
            } else if (res.length === 1) {
                renderCountryInfo(res);
            }
        });
}

function renderCountriesList(arr) {
    clearSpace();
    const listMarkUp = arr
        .map(el => {
            return `
                <li class="country-item">
                    <img class="country-img" src="${el.flags.svg}" alt="${el.name.common}" width="50px" height="100%">
                    <p class="country-name">${el.name.common}</p>
                </li>`;
        })
        .join('');
    
    refs.countryList.insertAdjacentHTML('beforeend', listMarkUp);
}

function renderCountryInfo(arr) {
    clearSpace();
    let cardCountryInfo = `
        <div class="country-main">
            <img class="country-img" src="${arr[0].flags.svg}" alt="${arr[0].name.common}" width="50px" height="100%">
            <p class="country-name">${arr[0].name.common}</p>
        </div>
        <div class="description">
            <p class="info-paragraphs"><span class="info-description">Capital:</span> ${arr[0].capital.join('')}</p>
            <p class="info-paragraphs"><span class="info-description">Population:</span> ${arr[0].population}</p>
            <p class="info-paragraphs"><span class="info-description">Languages:</span> ${Object.values(arr[0].languages).join(", ")}</p>
        </div>
    `;
    refs.countryInfo.insertAdjacentHTML('beforeend', cardCountryInfo);
}

function clearSpace() {
    refs.countryList.innerHTML = "";
    refs.countryInfo.innerHTML = "";
}