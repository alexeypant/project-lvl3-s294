import axios from 'axios';
import validator from 'validator';
import _ from 'lodash';
import parseXml from './xmlReader';

export const onInputChanged = (state) => {
  const isValid = !state.input || validator.isURL(state.input);
  state.updateIsInputValid(isValid);
};

const checkForNewArticles = (state) => {
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  const downloadPromises = state.urls.map(url => axios.get(`${proxyURL}${url}`));
  Promise.all(downloadPromises)
    .then((xmls) => {
      const articlesNotFlat = xmls.map(parseXml).map(el => el.articles);
      const articles = _.flatten(articlesNotFlat);
      const excistingArticlesTitles = state.articles.map(art => art.title);
      const newArticles = articles.filter(art => !excistingArticlesTitles.includes(art.title));
      if (newArticles.length > 0) {
        state.addNewArticles(newArticles);
      }
      setTimeout(checkForNewArticles(state), 5000);
    })
    .catch((error) => {
      console.log(error);
    });
};

const onFeedAdded = (state) => {
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  const download = axios.get(`${proxyURL}${state.urls[0]}`);
  (download)
    .then((xml) => {
      const { titles, articles } = parseXml(xml);
      state.addNewTitles(titles);
      state.addNewArticles(articles);
      if (!state.isRegularUpdateOn) {
        state.switchOnRegularUpdate();
        checkForNewArticles(state);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const onFormSubmitted = (state) => {
  if (state.isInputValid && !state.urls.includes(state.input)) {
    state.addNewUrl(state.input);
    onFeedAdded(state);
  }
  state.updateInput('');
};
