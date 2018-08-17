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

const buildDescriptionHtml = () => {
  const descriptionHtml = document.createElement('div');
  const title = document.createElement('h2');
  title.innerHTML = getFeedData(state.docs[0]).title;
  const description = document.createElement('p');
  description.innerHTML = getFeedData(state.docs[0]).description;
  descriptionHtml.appendChild(title);
  descriptionHtml.appendChild(description);
  return descriptionHtml;
};

const buildListItem = (item) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  li.classList.add('mt-1');
  a.innerHTML = item.title;
  a.href = item.link;
  li.appendChild(a);
  return li;
};

const buildArticlesHtml = () => {
  const list = document.createElement('ul');
  const { articles } = getFeedData(state.docs[0]);
  articles.forEach((item) => {
    const li = buildListItem(item);
    list.appendChild(li);
  });
  return list;
};

const renderDescription = () => {
  const $el = $('#description');
  const value = buildDescriptionHtml();
  $el.html(value);
};

const renderArticlesList = () => {
  const $el = $('#articles');
  const value = buildArticlesHtml();
  $el.html(value);
};

events.on('feedSubmitted', feedToAdd);
events.on('feedAdded', downloadFeedsData);
events.on('feedsDataDownloaded', parseFeedsData);
events.on('feedsDataParsed', renderDescription);
events.on('feedsDataParsed', renderArticlesList);
