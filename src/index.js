import 'bootstrap';
import './app.scss';
import $ from 'jquery';
import validator from 'validator';
import PubSub from './PubSub';

const state = {
  feeds: [],
};

const events = new PubSub();

const input = document.getElementById('feedUrlInput');
const form = document.getElementById('feedUrlForm');

input.addEventListener('input', () => {
  const value = input.value.trim();
  const isValid = !input.value || validator.isURL(value);
  if (isValid) {
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  const isValid = !input.value || validator.isURL(value);
  if (input.value && isValid) {
    input.value = '';
    events.emit('feedSubmitted', value);
  }
});

const feedToAdd = (feedUrl) => {
  if (!state.feeds.includes(feedUrl)) {
    state.feeds = [feedUrl, ...state.feeds];
    events.emit('feedAdded');
  }
};

const generateDescriptionList = () => {
  const $el = $('#feedsDescriptionList');
  $el.html(state.feeds.join(';'));
};

const generateNewsList = () => {
  const $el = $('#newsList');
  $el.html(state.feeds.join(','));
};

events.on('feedSubmitted', feedToAdd);
events.on('feedAdded', generateDescriptionList);
events.on('feedAdded', generateNewsList);
