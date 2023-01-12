import './css/styles.css';

import { fetchCountries } from './js/fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';



function countryСardTeemplate({ flags, name, capital, population, languages }) {
  return `
      <div class="country-info__wrapper">
        <img class="country-info__flags" src="${flags.svg}" alt="${name.official}" width="100" />
        <h2 class="country-info__title">${name.official}</h2>
      </div>
      <p class="country-info__capital">Capital: ${capital}</p>
      <p class="country-info__population">Population: ${population}</p>
      <p class="country-info__languages">Languages: ${Object.values(
        languages,
      )}</p>
  `;
}

function countryListTemplate({ flags, name }) {
  return `
  <li class="country-list__item">
    <img class="country-list__flags" src="${flags.svg}" alt="${name.official}" width="50" />
    <h2 class="country-list__name">${name.official}</h2>
  </li>
  `;
}

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;
refs.searchBox.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry() {
  const countryName = refs.searchBox.value.trim();


  fetchCountries(countryName)
    .then(countrys => {
      if (countrys.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (countrys.length <= 10) {
        const listMarkup = countrys.map(country => countryListTemplate(country));
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countrys.length === 1) {
        const markup = countrys.map(country => countryСardTeemplate(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      return error;
    });
}