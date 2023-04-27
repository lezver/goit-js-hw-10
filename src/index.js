import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.getElementsByClassName('country-list')[0],
  countryInfo: document.getElementsByClassName('country-info')[0],
};

const cleanOfInnerHTML = () => {
  refs.countryInfo.innerHTML = '';
  refs.countryInfo.style.backgroundColor = 'transparent';
  refs.countryList.innerHTML = '';
  refs.countryList.style.backgroundColor = 'transparent';
};

const errorOfFindCountry = () => {
  Notiflix.Notify.failure('Oops, there is no country with that name');
};

const manyMatchesFound = () => {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
};

const showCountries = arr => {
  cleanOfInnerHTML();

  refs.countryList.style.backgroundColor = 'rgb(192, 224, 252)';
  const markup = arr.reduce(
    (acc, { name, flags }) =>
      acc +
      `
			<li>
				<img src="${flags.svg}" alt="${name.official}">
				<h2>${name.common}</h2>
			</li>
			`,
    ''
  );

  return refs.countryList.insertAdjacentHTML('beforeend', markup);
};

const showOfInfoCountry = ([country]) => {
  cleanOfInnerHTML();

  refs.countryInfo.style.backgroundColor = 'rgba(184, 135, 11, 0.507)';

  const { name, capital, population, flags, languages } = country;

  const langsInCountry = Object.values(languages);

  const markup = `
		<img src="${flags.svg}" alt="${name.official}">
		<h1>${name.common}</h1>
		<p>Capital: <span>${capital}</span></p>
		<p>Population: <span>${population}</span></p>
		<p>Languages: <span>${langsInCountry.join(', ')}</span></p>
	`;

  return refs.countryInfo.insertAdjacentHTML('beforeend', markup);
};

const filterCountry = arr => {
  if (arr.length > 10) {
    manyMatchesFound();
  } else if (arr.length >= 2 || arr.length < 10) {
    showCountries(arr);
  }

  if (arr.length === 1) {
    showOfInfoCountry(arr);
  }
};

const valueForSearch = () => {
  const value = refs.searchBox.value;

  if (value.length <= 1) cleanOfInnerHTML();

  if (value)
    fetchCountries(value.trim()).then(filterCountry).catch(errorOfFindCountry);
};

refs.searchBox.addEventListener(
  'input',
  debounce(valueForSearch, DEBOUNCE_DELAY)
);
