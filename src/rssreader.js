import 'bootstrap';
import './app.scss';
import validator from 'validator';
import WatchJS from 'melanke-watchjs';
import { onFeedAdded, onXmlsReceived } from './controllers';
import { onTitlesChanged, onArticlesChanged } from './renderers';

const reader = () => {
  const state = {
    urls: [],
    xmls: [],
    titles: [],
    articles: [],
  };
  const updateState = newState => Object.assign(state, newState);

  const input = document.getElementById('feedUrlInput');
  const form = document.getElementById('feedUrlForm');

  const isInputValid = value => validator.isURL(value.trim());

  input.addEventListener('input', () => {
    if (isInputValid(input.value)) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }
  });

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
  watch(state, 'urls', () => onFeedAdded(state, updateState));
  watch(state, 'xmls', () => onXmlsReceived(state, updateState));
  watch(state, 'titles', () => onTitlesChanged(state, updateState));
  watch(state, 'articles', () => onArticlesChanged(state, updateState));
};

export default reader;
