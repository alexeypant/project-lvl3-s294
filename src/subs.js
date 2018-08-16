import Mustache from 'mustache';
import $ from 'jquery';
import events from './pubsub';

const stats = () => {
  let numberOfFeeds = 0;

  const $stats = $('#statsFeed');
  const template = $('#stats-template').html();

  const render = () => {
    $stats.html(Mustache.render(template, { numberOfFeeds }));
  };

  const setFeedStats = (newFeeds) => {
    numberOfFeeds = newFeeds;
    render();
  };

  events.on('feedsChanged', setFeedStats);
};

export default stats;
