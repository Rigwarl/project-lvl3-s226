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
    valid: true,
    value: '',
    error: '',
  };

  const updateState = newState => Object.assign(state, newState);

  const $form = $('#rss-form');
  const $list = $('#rss-list');

  $form.on('input', (e) => {
    const urls = state.feeds.map(({ url }) => url);
    const { value } = e.target;
    const { valid, error } = validateUrl(value, urls);

    updateState({ value, valid, error });
    updateForm($form, state);
  });

  const addUrl = (url) => {
    rssMap.set(url, { loading: true });

    axios.get(`https://crossorigin.me/${url}`)
      .then(({ data }) => {
        const feed = parseRss(data);
        const oldRssArr = Array.from(rssMap.values())
          .filter(({ loading }) => !loading)
          .reverse();

        rssMap.set(url, feed);
        renderRss($list, [feed, ...oldRssArr]);
      })
      .catch((err) => {
        console.error(err);

        rssMap.delete(url);
      });
  };
};

init();
