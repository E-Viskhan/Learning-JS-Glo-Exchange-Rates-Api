const activeClass = 'converter-switcher__item--active';
const firstConverterSwitcher = document.getElementById('converter-switcher-1');
const secondConverterSwitcher = document.getElementById('converter-switcher-2');
const inputElem = document.getElementById('input-currency');
const outputElem = document.getElementById('output-currency');
const baseCurrency = 'EUR';

let inputCurrency = 'USD', outputCurrency = 'RUB';
let rates;

const getRatesFromApi = async () => {
  const getApiUrl = () => {
    const apiUrl = new URL('v1/latest', 'http://api.exchangeratesapi.io/');
    apiUrl.searchParams.set('access_key', 'b65e1268c6cc3789b03b9648256f9717');
    apiUrl.searchParams.set('symbols', 'USD,RUB');

    return apiUrl;
  };

  fetch(getApiUrl())
    .then(response => response.json())
    .then(json => {
      rates = json.rates;
      rates[json.base] = 1;
    })
    .catch(err => console.log(new Error('Ошибка при получении актуальных курсов валют.')));
};


const calcResult = () => {
  const isInputValid = () => {
    inputElem.value = inputElem.value.replace(',', '.').replace(/[^\d\.]/gi, '');

    if (inputElem.value === '') {
      outputElem.value = '';
      return false;
    }

    return true;
  };

  if (!isInputValid()) { return; }

  if (inputCurrency === outputCurrency) {
    outputElem.value = inputElem.value;
    return;
  }

  if (inputCurrency !== baseCurrency) {
    outputElem.value = (inputElem.value / rates[inputCurrency] * rates[outputCurrency]).toFixed(2);
  } else {
    outputElem.value = (inputElem.value * rates[outputCurrency]).toFixed(2);
  }

};

const changeCurrency = (target, switcher) => {
  if (target.classList.contains(activeClass)) { return; }

  switcher.querySelector('.' + activeClass).classList.remove(activeClass);
  target.classList.add(activeClass);
  switcher === firstConverterSwitcher ? inputCurrency = target.id : outputCurrency = target.id;


};

firstConverterSwitcher.addEventListener('click', (e) => {
  changeCurrency(e.target, firstConverterSwitcher);
  calcResult();
});

secondConverterSwitcher.addEventListener('click', (e) => {
  changeCurrency(e.target, secondConverterSwitcher);
  calcResult();
});

inputElem.addEventListener('input', calcResult);

getRatesFromApi();