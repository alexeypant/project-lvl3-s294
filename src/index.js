import 'bootstrap';
import './app.scss';
// import $ from 'jquery';
import validator from 'validator';

const state = {
  input: {
    value: '',
    isValid: true,
  },
  feeds: [],
};

const form = document.getElementById('feedUrlForm');
const input = document.getElementById('feedUrlInput');

const onInputChange = () => {
  const value = input.value.trim();
  state.input.value = value;
  state.input.isValid = !input.value || validator.isURL(value);
  if (state.input.isValid) {
    input.classList.remove('invalidInput');
  } else {
    input.classList.add('invalidInput');
  }
};

input.addEventListener('change', () => {
  onInputChange();
});
input.addEventListener('input', () => {
  onInputChange();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
});
