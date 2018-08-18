import 'bootstrap';
import './app.scss';
import validator from 'validator';
import WatchJS from 'melanke-watchjs';
import { onFeedAdded, onXmlsReceived } from './controllers';
import { onTitlesChanged, onArticlesChanged } from './renderers';

export default () => {
  const state = {
    urls: [],
    xmls: [],
    titles: [],
    articles: [],
    setXmls(newXmls) {
      this.xmls = newXmls;
    },
    setTitles(newTitles) {
      this.titles = newTitles;
    },
    setArticles(newArticles) {
      this.articles = newArticles;
    },
  };

  const isInputValid = value => validator.isURL(value.trim());

  const input = document.getElementById('feedUrlInput');
  input.addEventListener('input', () => {
    if (isInputValid(input.value)) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }
  });

  const form = document.getElementById('feedUrlForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (isInputValid(value)) {
      input.value = '';
      if (!state.urls.includes(value)) {
        state.urls = [value, ...state.urls];
      }
    }
  });

  const { watch } = WatchJS;
  watch(state, 'urls', () => onFeedAdded(state));
  watch(state, 'xmls', () => onXmlsReceived(state));
  watch(state, 'titles', () => onTitlesChanged(state));
  watch(state, 'articles', () => onArticlesChanged(state));
};
