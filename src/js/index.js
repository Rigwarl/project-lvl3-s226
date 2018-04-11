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
    urlValue: '',
    urlValid: false,
    formError: '',
    formDisabled: false,
  };

  const updateState = newState => Object.assign(state, newState);

  const $form = $('#rss-form');
  const $list = $('#rss-list');

  updateForm($form, state);

  $form.on('input', (e) => {
    const existUrls = state.feeds.map(({ url }) => url);
    const { value } = e.target;
    const { valid, error } = validateUrl(value, existUrls);

    updateState({
      urlValue: value,
      urlValid: valid,
      formError: error,
    });
    updateForm($form, state);
  });

  $form.on('submit', (e) => {
    e.preventDefault();

    updateState({ formDisabled: true });
    updateForm($form, state);

    axios.get(`https://crossorigin.me/${state.urlValue}`)
      .then(({ data }) => {
        const rss = parseRss(data);
        const feed = { ...rss, url: state.urlValue };

        updateState({
          urlValue: '',
          urlValid: false,
          formError: '',
          formDisabled: false,
          feeds: [feed, ...state.feeds],
        });
        renderRss($list, state.feeds);
        updateForm($form, state);
      })
      .catch((err) => {
        console.error(err);

        updateState({
          formDisabled: false,
          formError: 'Loading error, check url or try again later',
        });
        updateForm($form, state);
      });
  });
};

init();
