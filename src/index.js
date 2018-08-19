import 'bootstrap';
import './app.scss';
import rssreader from './rssreader';
import State from './State';

const state = new State();

rssreader(state);
