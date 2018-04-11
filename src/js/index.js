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
    feedUrl: '',
    formStatus: 'empty', // empty|error|valid|disabled
    formError: '',
  };

  const $form = $('#rss-form');
  const $list = $('#rss-list');

  const updateState = newState => Object.assign(state, newState);

  const validateForm = () => {
    const existUrls = state.feeds.map(({ url }) => url);
    const { valid, error } = validateUrl(state.feedUrl, existUrls);

    updateState({
      formStatus: valid ? 'valid' : 'error',
      formError: error,
    });
  };

  const loadFeed = () => axios.get(`https://crossorigin.me/${state.feedUrl}`)
    .then(({ data }) => {
      const rss = parseRss(data);
      const feed = { ...rss, url: state.feedUrl };

      updateState({
        feedUrl: '',
        formError: '',
        formStatus: 'empty',
        feeds: [feed, ...state.feeds],
      });
      updateRss($list, state.feeds);
      updateForm($form, state);
    })
    .catch((err) => {
      console.error(err);

      updateState({
        formStatus: 'error',
        formError: 'Loading error, check url or try again later',
      });
      updateForm($form, state);
    });

  $form.on('input', (e) => {
    updateState({ feedUrl: e.target.value });
    validateForm();
    updateForm($form, state);
  });

  $form.on('submit', (e) => {
    e.preventDefault();

    validateForm();

    if (state.formStatus === 'valid') {
      updateState({ formStatus: 'disabled' });
      loadFeed();
    }

    updateForm($form, state);
  });

  updateForm($form, state);
};

init();
