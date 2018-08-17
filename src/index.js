import 'bootstrap';
import './app.scss';
import $ from 'jquery';
import axios from 'axios';
import validator from 'validator';
import _ from 'lodash';
import PubSub from './PubSub';
import getFeedData from './xmlReader';


const state = {
  feeds: [],
  responses: [],
  docs: [],
  articlesAllFlat: [],
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
      // setTimeout(downloadFeedsData, 5000);
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      setTimeout(downloadFeedsData, 5000);
    });
};

const parseFeedsData = () => {
  const newDocs = state.responses.map(el => parser.parseFromString(el.data, 'application/xml'));
  const articlesFromAll = newDocs.map((el) => {
    const titleDescriptionArticles = getFeedData(el);
    return titleDescriptionArticles.articles;
  });
  const articlesAllFlat = _.flatten(articlesFromAll);
  if (state.docs.length !== newDocs.length) {
    state.docs = newDocs;
    events.emit('newDocsReceived');
  } else {
    const excistingArticlesTitles = state.articlesAllFlat.map(art => art.title);
    const newArticles = articlesAllFlat.filter(art => !excistingArticlesTitles.includes(art.title));
    if (newArticles.length !== 0) {
      state.articlesAllFlat = [...newArticles, ...state.articlesAllFlat];
      events.emit('newArticlesReceived');
    }
  }
};

const buildDescriptionHtml = () => {
  const descriptionItemsHtml = state.docs.map((el) => {
    const titleDescriptionArticleData = getFeedData(el);
    const divItem = document.createElement('div');
    const title = document.createElement('h2');
    title.innerHTML = titleDescriptionArticleData.title;
    const description = document.createElement('p');
    description.innerHTML = titleDescriptionArticleData.description;
    divItem.appendChild(title);
    divItem.appendChild(description);
    return divItem;
  });
  return descriptionItemsHtml;
};

const buildListItem = (item) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  li.classList.add('mt-1');
  a.innerHTML = item.title;
  a.href = item.link;
  li.appendChild(a);
  const button = document.createElement('button');
  button.innerHTML = 'Description';
  button.classList.add('btn', 'btn-primary', 'btn-sm', 'ml-2');
  button.type = 'button';
  button.dataset.toggle = 'modal';
  button.dataset.target = '#descriptionModal';
  button.addEventListener('click', () => {
    const $el = $('#modalBody');
    $el.html(item.description);
  });
  li.appendChild(button);

  return li;
};

const buildArticlesHtml = () => {
  const list = document.createElement('ul');
  state.articlesAllFlat.forEach((item) => {
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
events.on('newDocsReceived', renderDescription);
events.on('newDocsReceived', renderArticlesList);
events.on('newArticlesReceived', renderArticlesList);
