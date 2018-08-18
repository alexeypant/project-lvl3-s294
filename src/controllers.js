import axios from 'axios';
import _ from 'lodash';
import { getTitleAndDescriptionFromXml, getArticlesFromXml } from './xmlReader';


const parser = new DOMParser();

export const onFeedAdded = (state, updateState) => {
  const { urls } = state;
  if (urls.length === 0) return;
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';

  const downloadPromises = urls.map(url => axios.get(`${proxyURL}${url}`));
  Promise.all(downloadPromises)
    .then((xmls) => {
      updateState({ ...state, xmls });
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      setTimeout(onFeedAdded(state), 5000);
    });
};

export const onXmlsReceived = (state, updateState) => {
  const docs = state.xmls.map(el => parser.parseFromString(el.data, 'application/xml'));
  const titles = docs.map(doc => getTitleAndDescriptionFromXml(doc));
  if (state.titles.length !== titles.length) {
    updateState({ ...state, titles });
  }
  const articlesNotFlat = docs.map(doc => getArticlesFromXml(doc));
  const articles = _.flatten(articlesNotFlat);
  const excistingArticlesTitles = state.articles.map(art => art.title);
  const newArticles = articles.filter(art => !excistingArticlesTitles.includes(art.title));
  if (newArticles.length > 0) {
    const updatedArticlesList = [...newArticles, ...state.articles];
    updateState({ ...state, articles: updatedArticlesList });
  }

  // const newDocs = state.xmls.map(el => parser.parseFromString(el.data, 'application/xml'));
  // const articlesFromAll = newDocs.map((el) => {
  //   const titleDescriptionArticles = getFeedData(el);
  //   return titleDescriptionArticles.articles;
  // });
  // const articlesAllFlat = _.flatten(articlesFromAll);
  // if (state.docs.length !== newDocs.length) {
  //   updateState({ ...state, docs: newDocs, articlesAllFlat });
  // } else {
  //   const excistingArticlesTitles = state.articlesAllFlat.map(art => art.title);
  //   const newArticles = articlesAllFlat.filter
  // (art => !excistingArticlesTitles.includes(art.title));
  //   if (newArticles.length !== 0) {
  //     const updatedArticlesList = [...newArticles, ...state.articlesAllFlat];
  //     updateState({ ...state, articlesAllFlat: updatedArticlesList });
  //   }
  // }
};
