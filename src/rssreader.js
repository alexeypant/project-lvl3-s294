import 'bootstrap';
import './app.scss';
import WatchJS from 'melanke-watchjs';
import { onInputChanged, onFormSubmitted } from './controllers';
import { renderIsInputValid, renderTitles, renderArticles } from './renderers';

export default (state) => {
  const input = document.getElementById('feedUrlInput');
  input.addEventListener('input', () => {
    state.updateInput(input.value.trim());
    onInputChanged(state);
  });

  const form = document.getElementById('feedUrlForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    input.value = '';
    onFormSubmitted(state);
  });

  const { watch } = WatchJS;
  watch(state, 'isInputValid', () => renderIsInputValid(state));
  watch(state, 'titles', () => renderTitles(state));
  watch(state, 'articles', () => renderArticles(state));
};
