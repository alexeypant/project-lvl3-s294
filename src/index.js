import 'bootstrap';
import './app.scss';
import $ from 'jquery';
import validator from 'validator';

const state = {
  input: {
    value: '',
    isValid: true,
  },
  feeds: [],
};
