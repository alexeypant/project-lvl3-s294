import axios from 'axios';
import _ from 'lodash';
import getFeedData from './xmlReader';
import { updateReaderState } from './rssreader';

const parser = new DOMParser();

export const feedToAdd = (state) => {
  if (!state.feeds.includes(state.feedSubmitted)) {
    const newFeedsList = [state.feedSubmitted, ...state.feeds];
    updateReaderState({ ...state, feeds: newFeedsList });
  }
};

export const downloadFeedsData = (state) => {
  const urls = state.feeds;
  if (urls.length === 0) return;
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';

  const downloadPromises = urls.map(url => axios.get(`${proxyURL}${url}`));
  Promise.all(downloadPromises)
    .then((responses) => {
      updateReaderState({ ...state, responses });
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      setTimeout(downloadFeedsData(state), 5000);
    });
};

export const parseFeedsData = (state) => {
  const newDocs = state.responses.map(el => parser.parseFromString(el.data, 'application/xml'));
  const articlesFromAll = newDocs.map((el) => {
    const titleDescriptionArticles = getFeedData(el);
    return titleDescriptionArticles.articles;
  });
  const articlesAllFlat = _.flatten(articlesFromAll);
  if (state.docs.length !== newDocs.length) {
    updateReaderState({ ...state, docs: newDocs, articlesAllFlat });
  } else {
    const excistingArticlesTitles = state.articlesAllFlat.map(art => art.title);
    const newArticles = articlesAllFlat.filter(art => !excistingArticlesTitles.includes(art.title));
    if (newArticles.length !== 0) {
      const updatedArticlesList = [...newArticles, ...state.articlesAllFlat];
      updateReaderState({ ...state, articlesAllFlat: updatedArticlesList });
    }
  }
};
