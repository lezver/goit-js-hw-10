const URL = 'https://restcountries.com/v3.1/name/';

const fetchCountries = name =>
  fetch(URL + name).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });

export { fetchCountries };
