import 'bootstrap';
import './app.scss';
import WatchJS from 'melanke-watchjs';
import { onInputChanged, onFeedAdded, onXmlsReceived } from './controllers';
import { onIsInputValidChanged, onTitlesChanged, onArticlesChanged } from './renderers';


export default () => {
  const state = {
    input: '',
    isInputValid: true,
    urls: [],
    xmls: [],
    titles: [],
    articles: [],
    setInput(newInput) {
      this.input = newInput;
    },
    setIsInputValid(newState) {
      this.isInputValid = newState;
    },
    setUrls(newUrls) {
      this.urls = newUrls;
    },
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

  const input = document.getElementById('feedUrlInput');
  input.addEventListener('input', () => {
    state.setInput(input.value.trim());
  });

  const form = document.getElementById('feedUrlForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.isInputValid && !state.urls.includes(state.input)) {
      state.setUrls([state.input, ...state.urls]);
    }
    state.setInput('');
    input.value = ''; // do we need to add separate renderer for this to be more close to MVC??
  });

  const { watch } = WatchJS;
  watch(state, 'input', () => onInputChanged(state));
  watch(state, 'isInputValid', () => onIsInputValidChanged(state));
  watch(state, 'urls', () => onFeedAdded(state));
  watch(state, 'xmls', () => onXmlsReceived(state));
  watch(state, 'titles', () => onTitlesChanged(state));
  watch(state, 'articles', () => onArticlesChanged(state));
};
