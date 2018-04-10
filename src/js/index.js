import 'bootstrap';
import $ from 'jquery';
import axios from 'axios';

import parseRss from './parse-rss';
import renderRss from './render-rss';
import validateUrl from './validate-url';
import updateForm from './update-form';

const init = () => {
  const state = {
    feeds: [],
    disabled: false,
    valid: true,
    error: '',
    url: '',
  };

  const updateState = newState => Object.assign(state, newState);

  const $form = $('#rss-form');
  const $list = $('#rss-list');

  $form.on('input', (e) => {
    const urls = state.feeds.map(({ url }) => url);
    const url = e.target.value;
    const { valid, error } = validateUrl(url, urls);

    updateState({ url, valid, error });
    updateForm($form, state);
  });

  $form.on('submit', (e) => {
    e.preventDefault();

    if (state.disabled) {
      return;
    }

    updateState({ disabled: true });
    updateForm($form, state);

    axios.get(`https://crossorigin.me/${state.url}`)
      .then(({ data }) => {
        const feed = parseRss(data);

        updateState({
          url: '',
          disabled: false,
          feeds: [feed, ...state.feeds],
        });
        renderRss($list, state.feeds);
        updateForm($form, state);
      })
      .catch((err) => {
        console.error(err);

        updateState({
          valid: false,
          disabled: false,
          error: 'Loading error, try again later',
        });
        updateForm($form, state);
      });
  });
};

init();
