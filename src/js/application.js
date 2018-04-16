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

  const getFeed = async (url): Promise<ParsedFeed> => {
    const { data } = await axios.get(url);

    return parseRss(data);
  };

  const getNewFeed = async (): Promise<Feed> => {
    const parsedFeed = await getFeed(state.feedUrl);

    return {
      ...parsedFeed,
      id: state.feedId,
      url: state.feedUrl,
    };
  };

  const loadNewFeed = async (): Promise<void> => {
    try {
      const feed = await getNewFeed();

      updateState({
        feedId: state.feedId + 1,
        feedUrl: '',
        feedError: '',
        feedStatus: 'empty',
        feeds: [feed, ...state.feeds],
      });
      updateFeeds($list, state.feeds);
      updateForm($form, state);
    } catch (err) {
      console.error(err);

      updateState({
        feedStatus: 'error',
        feedError: 'Loading error, check url or try again later',
      });
      updateForm($form, state);
    }
  };

  const getFeedUpdate = async ({ id, url }): Promise<?Feed> => {
    try {
      const parsedFeed = await getFeed(url);

      return { ...parsedFeed, id, url };
    } catch (err) {
      console.error(err);

      return null;
    }
  };

  const loadFeedsUpdate = async (): Promise<void> => {
    const newFeeds = await Promise.all(state.feeds.map(getFeedUpdate));

    const feeds = state.feeds.map((feed): Feed => {
      const newFeed = newFeeds.find((f): boolean => !!f && f.id === feed.id);
      return newFeed || feed;
    });

    updateState({ feeds });
    updateFeeds($list, state.feeds);

    setTimeout(loadFeedsUpdate, 5 * 1000);
  };

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
