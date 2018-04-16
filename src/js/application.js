// @flow

import 'bootstrap';
import $ from 'jquery';
import axios from 'axios';

import parseRss from './parse-rss';
import updateFeeds from './update-feeds';
import validateUrl from './validate-url';
import updateForm from './update-form';

import type { Feed, ParsedFeed } from './types/Feed';
import type { State } from './types/State';

export default (): void => {
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

  const updateState = (newState): State => Object.assign(state, newState);

  const validateFeed = (): void => {
    const existUrls = state.feeds.map(({ url }) => url);
    const { valid, error } = validateUrl(state.feedUrl, existUrls);

    updateState({
      feedStatus: valid ? 'valid' : 'error',
      feedError: error,
    });
  };

  const getFeed = (url): Promise<ParsedFeed> => axios.get(url)
    .then(({ data }): ParsedFeed => parseRss(data));

  const loadNewFeed = (): Promise<void> => getFeed(state.feedUrl)
    .then((rss): void => {
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
      updateFeeds($list, state.feeds);
      updateForm($form, state);
    })
    .catch((err): void => {
      console.error(err);

      updateState({
        feedStatus: 'error',
        feedError: 'Loading error, check url or try again later',
      });
      updateForm($form, state);
    });

  const getFeedUpdate = ({ id, url }): Promise<?Feed> => getFeed(url)
    .then((rss): Feed => ({ ...rss, id, url }))
    .catch((err): void => console.error(err));

  const loadFeedsUpdate = (): Promise<TimeoutID> => Promise.all(state.feeds.map(getFeedUpdate))
    .then((newFeeds): void => {
      if (!newFeeds.length) { return; }

      const feeds = state.feeds.map((feed): Feed => {
        const newFeed = newFeeds.find((f): boolean => !!f && f.id === feed.id);
        return newFeed || feed;
      });

      updateState({ feeds });
      updateFeeds($list, state.feeds);
    })
    .then((): TimeoutID => setTimeout(loadFeedsUpdate, 5 * 1000));

  $form.on('input', (e): void => {
    if (!(e.target instanceof HTMLInputElement)) { return; }

    updateState({ feedUrl: e.target.value });
    validateFeed();
    updateForm($form, state);
  });

  $form.on('submit', (e): void => {
    e.preventDefault();

    validateFeed();

    if (state.feedStatus === 'valid') {
      updateState({ feedStatus: 'loading' });
      loadNewFeed();
    }

    updateForm($form, state);
  });

  $modal.on('show.bs.modal', (e): void => {
    if (!(e.relatedTarget instanceof HTMLElement)) { return; }

    const { feedId, itemId } = e.relatedTarget.dataset;
    const feed = state.feeds.find(({ id }): boolean => id === +feedId);

    if (!feed) { return; }

    const item = feed.items.find(({ id }): boolean => id === +itemId);

    if (!item) { return; }

    $modal.find('[data-selector=title]').text(item.title);
    $modal.find('[data-selector=content]').text(item.description);
  });

  updateForm($form, state);
  loadFeedsUpdate();
};
