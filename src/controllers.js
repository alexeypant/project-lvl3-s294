import axios from 'axios';
import _ from 'lodash';
import validator from 'validator';
import { getTitleAndDescriptionFromXml, getArticlesFromXml, parseXml } from './xmlReader';

export const onInputChanged = (state) => {
  const isValid = !state.input || validator.isURL(state.input);
  state.updateIsInputValid(isValid);
};

// const parser = new DOMParser();

// const onFeedAddedOld = (state) => {
//   const proxyURL = 'https://cors-anywhere.herokuapp.com/';
//   const downloadPromises = state.urls.map(url => axios.get(`${proxyURL}${url}`));
//   Promise.all(downloadPromises)
//     .then((xmls) => {
//       const docs = xmls.map(el => parser.parseFromString(el.data, 'application/xml'));
//       const titles = docs.map(doc => getTitleAndDescriptionFromXml(doc));
//       if (state.titles.length !== titles.length) {
//         state.updateTitles(titles);
//       }
//       const articlesNotFlat = docs.map(doc => getArticlesFromXml(doc));
//       const articles = _.flatten(articlesNotFlat);
//       const excistingArticlesTitles = state.articles.map(art => art.title);
//       const newArticles = articles.filter(art => !excistingArticlesTitles.includes(art.title));
//       if (newArticles.length > 0) {
//         const updatedArticlesList = [...newArticles, ...state.articles];
//         state.updateArticles(updatedArticlesList);
//       }
//     })
//     .catch(() => {
//       setTimeout(onFeedAdded(state), 5000);
//     })
//     .then(() => {
//       setTimeout(onFeedAdded(state), 5000);
//     });
// };


const onFeedAdded = (state) => {
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  const download = axios.get(`${proxyURL}${state.urls[0]}`);
  (download)
    .then((xml) => {
      const { titles, articles } = parseXml(xml);
      state.updateTitles([titles, ...state.titles]);
      state.updateArticles([...articles, ...state.articles]);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const onFormSubmitted = (state) => {
  if (state.isInputValid && !state.urls.includes(state.input)) {
    state.updateUrls([state.input, ...state.urls]);
    onFeedAdded(state);
  }
  state.updateInput('');
};
