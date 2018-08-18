import axios from 'axios';
import _ from 'lodash';
import validator from 'validator';
import { getTitleAndDescriptionFromXml, getArticlesFromXml } from './xmlReader';


export const onInputChanged = (state) => {
  const isValid = !state.input || validator.isURL(state.input);
  state.setIsInputValid(isValid);
};

export const onFeedAdded = (state) => {
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  const downloadPromises = state.urls.map(url => axios.get(`${proxyURL}${url}`));
  Promise.all(downloadPromises)
    .then((xmls) => {
      state.setXmls(xmls);
    })
    .catch(() => {
      setTimeout(onFeedAdded(state), 5000);
    })
    .then(() => {
      setTimeout(onFeedAdded(state), 5000);
    });
};

export const onXmlsReceived = (state) => {
  const parser = new DOMParser();
  const docs = state.xmls.map(el => parser.parseFromString(el.data, 'application/xml'));
  const titles = docs.map(doc => getTitleAndDescriptionFromXml(doc));
  if (state.titles.length !== titles.length) {
    state.setTitles(titles);
  }
  const articlesNotFlat = docs.map(doc => getArticlesFromXml(doc));
  const articles = _.flatten(articlesNotFlat);
  const excistingArticlesTitles = state.articles.map(art => art.title);
  const newArticles = articles.filter(art => !excistingArticlesTitles.includes(art.title));
  if (newArticles.length > 0) {
    const updatedArticlesList = [...newArticles, ...state.articles];
    state.setArticles(updatedArticlesList);
  }
};
