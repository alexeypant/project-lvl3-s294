import 'bootstrap';
import './app.scss';
import $ from 'jquery';
import validator from 'validator';
import PubSub from './PubSub';

const state = {
  feeds: ['ti.com'],
  news: [],
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


// const onFormSubmit = () => {
//   if (state.input.isValid) {
//     const previousFeeds = state.feeds;
//     state.feeds = [state.input.value, ...previousFeeds];
//   }
//   state.input.value = '';
//   state.input.isValid = true;
// };

const newsToAdd = (newFeed) => {
  state.news = [newFeed.value, ...state.news];
  const $el = $('#newsList');
  $el.html(state.news);
};

events.on('feedSubmitted', newsToAdd);

// const input = {
//   input: {
//     value: '',
//     isValid: true,
//   },
//   init() {
//     this.cacheDom();
//     this.bindEvents();
//   },
//   cacheDom() {
//     this.$el = $('#feedUrlForm');
//     this.$input = this.$el.find('input');
//     this.$button = this.$el.find('button');
//   },
//   bindEvents() {
//     this.$input.on('input', this.getInput.bind(this));
//     this.$button.on('click', this.submitFeed.bind(this));
//   },
//   getInput() {
//     const value = this.$input.val().trim();
//     this.input.value = value;
//     this.input.isValid = !this.input.value || validator.isURL(value);
//     if (this.input.isValid) {
//       this.$input.removeClass('is-invalid');
//     } else {
//       this.$input.addClass('is-invalid');
//     }
//   },
//   submitFeed() {
//     this.$input.val('');
//     events.emit('feedSubmitted', this.input);
//   },
// };

// const feeds = {
//   feeds: ['http://analog.com', 'http://ti.com'],
//   init() {
//     this.cacheDom();
//     // this.render();
//     events.on('feedSubmitted', this.addFeed.bind(this));
//   },
//   cacheDom() {
//     this.$el = $('#feedsList');
//     this.$p = this.$el.find('p');
//   },
//   render() {
//     const data = this.feeds.join('');
//     this.$p.html(data);
//     console.log(data);
//   },
//   addFeed(newFeed) {
//     this.feeds = [newFeed.value, ...this.feeds];
//     this.render();
//   },
// };

// const news = {
//   newsList: [],
//   init() {
//     events.on('feedSubmitted', this.addNews.bind(this));
//   },
//   addNews(newFeed) {
//     this.newsList = [newFeed.value, ...this.feeds];
//     // this.render();
//   },
// };

// input.init();
// feeds.init();
// news.init();
