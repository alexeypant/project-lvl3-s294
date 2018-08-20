import axios from 'axios';
import validator from 'validator';
import _ from 'lodash';
import parseXml from './xmlReader';

export const onInputChanged = (state) => {
  const isValid = !state.input || validator.isURL(state.input);
  state.setInputValid(isValid);
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
    })
    .catch((error) => {
      console.log(error);
    });
};

const timeout = (state) => {
  setTimeout(() => {
    checkForNewArticles(state);
    timeout(state);
  }, 5000);
};

export const onFormSubmitted = (state) => {
  const newUrl = state.input;
  state.setInput('');
  if (state.isInputValid && !state.urls.includes(newUrl)) {
    state.addNewUrl(newUrl);
    const proxyURL = 'https://cors-anywhere.herokuapp.com/';
    (axios.get(`${proxyURL}${newUrl}`))
      .then((xml) => {
        const { title, articles } = parseXml(xml);
        state.addNewTitle(title);
        state.addNewArticles(articles);
        if (!state.isRegularUpdateOn) {
          state.switchOnRegularUpdate();
          timeout(state);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
