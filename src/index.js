import 'bootstrap';
import './app.scss';
import $ from 'jquery';
import axios from 'axios';
import validator from 'validator';
import PubSub from './PubSub';
import getFeedData from './parsers';

const state = {
  feeds: [],
  responses: [],
  docs: '',
};

const parser = new DOMParser();
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

const downloadFeedsData = () => {
  const urls = state.feeds;
  if (urls.length === 0) return;
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';

  const downloadPromises = urls.map(url => axios.get(`${proxyURL}${url}`));
  Promise.all(downloadPromises)
    .then((responses) => {
      state.responses = responses;
      events.emit('feedsDataDownloaded');
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      // console.log('done');
    });
};

const parseFeedsData = () => {
  state.docs = state.responses.map(el => parser.parseFromString(el.data, 'application/xml'));
  events.emit('feedsDataParsed');
};

const generateDescriptionList = () => {
  const $el = $('#feedsDescriptionList');
  const { title, description } = getFeedData(state.docs[0]);
  const value = `Title: ${title} Description: ${description}`;
  $el.html(value);
};

const generateNewsList = () => {
  const $el = $('#newsList');
  const { articles } = getFeedData(state.docs[0]);
  const value = articles.reduce((acc, item) => `${acc} \n ${item.title}`, '');
  $el.html(value);
};

events.on('feedSubmitted', feedToAdd);
events.on('feedAdded', downloadFeedsData);
events.on('feedsDataDownloaded', parseFeedsData);
events.on('feedsDataParsed', generateDescriptionList);
events.on('feedsDataParsed', generateNewsList);
