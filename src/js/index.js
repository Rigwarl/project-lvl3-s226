import 'bootstrap';
import $ from 'jquery';
import axios from 'axios';

import parseRss from './parse-rss';
import updateRss from './update-rss';
import validateUrl from './validate-url';
import updateForm from './update-form';

const init = () => {
  const state = {
    feeds: [],
    feedId: 0,
    feedUrl: '',
    feedError: '',
    feedStatus: 'empty', // empty|error|valid|loading
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

  const loadFeed = () => axios.get(state.feedUrl)
    .then(({ data }) => {
      const rss = parseRss(data);
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
      loadFeed();
    }

    updateForm($form, state);
  });

  $modal.on('show.bs.modal', (e) => {
    const { feedId, itemId } = e.relatedTarget.dataset;
    const { items } = state.feeds.find(({ id }) => id === +feedId);
    const { title, description } = items.find(({ id }) => id === +itemId);

    $modal.find('[data-selector=title]').text(title);
    $modal.find('[data-selector=content]').text(description);
  });

  updateForm($form, state);
};

init();
