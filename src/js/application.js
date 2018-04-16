// @flow

import 'bootstrap';
import $ from 'jquery';
import axios from 'axios';

import parseRss from './parse-rss';
import updateRss from './update-rss';
import validateUrl from './validate-url';
import updateForm from './update-form';

type FeedItem = {
  id: number,
  url: string,
  title: string,
  description: string,
};

type Feed = {
  id: number,
  url: string,
  items: FeedItem[],
  title: string,
  description: string,
};

type State = {
  feeds: Feed[],
  feedId: number,
  feedUrl: string,
  feedError: string,
  feedStatus: 'empty' | 'error' | 'valid' | 'loading',
};

export default () => {
  const state: State = {
    feeds: [],
    feedId: 0,
    feedUrl: '',
    feedError: '',
    feedStatus: 'empty',
  };

  const $form = $('#rss-form');
  const $list = $('#rss-list');
  const $modal = $('#rss-modal');

  const updateState = newState => Object.assign(state, newState);

  const validateFeed = () => {
    const existUrls = state.feeds.map(({ url }) => url);
    const { valid, error } = validateUrl(state.feedUrl, existUrls);

    updateState({
      feedStatus: valid ? 'valid' : 'error',
      feedError: error,
    });
  };

  const getFeed = url => axios.get(url)
    .then(({ data }) => parseRss(data));

  const loadNewFeed = () => getFeed(state.feedUrl)
    .then((rss) => {
      const feed = {
        ...rss,
        id: state.feedId,
        url: state.feedUrl,
      };

      updateState({
        feedId: state.feedId + 1,
        feedUrl: '',
        feedError: '',
        feedStatus: 'empty',
        feeds: [feed, ...state.feeds],
      });
      updateRss($list, state.feeds);
      updateForm($form, state);
    })
    .catch((err) => {
      console.error(err);

      updateState({
        feedStatus: 'error',
        feedError: 'Loading error, check url or try again later',
      });
      updateForm($form, state);
    });

  const getFeedUpdate = ({ id, url }) => getFeed(url)
    .then(rss => ({ ...rss, id, url }))
    .catch((err) => {
      console.error(err);

      return { id: null };
    });

  const loadFeedsUpdate = () => Promise.all(state.feeds.map(getFeedUpdate))
    .then((newFeeds) => {
      if (!newFeeds.length) {
        return;
      }

      const feeds = state.feeds.map((feed) => {
        const newFeed = newFeeds.find(({ id }) => id === feed.id);
        return newFeed || feed;
      });

      updateState({ feeds });
      updateRss($list, state.feeds);
    })
    .then(() => setTimeout(loadFeedsUpdate, 5 * 1000));

  $form.on('input', (e) => {
    updateState({ feedUrl: e.target.value });
    validateFeed();
    updateForm($form, state);
  });

  $form.on('submit', (e) => {
    e.preventDefault();

    validateFeed();

    if (state.feedStatus === 'valid') {
      updateState({ feedStatus: 'loading' });
      loadNewFeed();
    }

    updateForm($form, state);
  });

  $modal.on('show.bs.modal', (e) => {
    const { feedId, itemId } = e.relatedTarget.dataset;
    const feed = state.feeds.find(({ id }) => id === +feedId);

    if (!feed) { return; }

    const item = feed.items.find(({ id }) => id === +itemId);

    if (!item) { return; }

    $modal.find('[data-selector=title]').text(item.title);
    $modal.find('[data-selector=content]').text(item.description);
  });

  updateForm($form, state);
  loadFeedsUpdate();
};
