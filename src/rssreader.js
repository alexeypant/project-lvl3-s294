import 'bootstrap';
import './app.scss';
import validator from 'validator';
import WatchJS from 'melanke-watchjs';
import { feedToAdd, downloadFeedsData, parseFeedsData } from './controllers';
import { renderDescription, renderArticlesList } from './renderers';

const state = {
  feedSubmitted: '',
  feeds: [],
  responses: [],
  docs: [],
  articlesAllFlat: [],
};

const { watch } = WatchJS;

export const updateReaderState = newState => Object.assign(state, newState);

const reader = () => {
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
      state.feedSubmitted = value;
    }
  });

  watch(state, 'feedSubmitted', () => feedToAdd(state));
  watch(state, 'feeds', () => downloadFeedsData(state));
  watch(state, 'responses', () => parseFeedsData(state));
  watch(state, 'docs', () => renderDescription(state));
  watch(state, 'articlesAllFlat', () => renderArticlesList(state));
};

export default reader;
