import 'bootstrap';
import $ from 'jquery';
import axios from 'axios';

import parseRss from './parse-rss';
import renderRss from './render-rss';
import validateUrl from './validate-url';
import bindFormEvents from './bind-form-events';

const init = () => {
  const rssMap = new Map();
  const $form = $('#rss-form');
  const $list = $('#rss-list');

  const addRssUrl = (url) => {
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

  bindFormEvents({
    $form,
    onSubmit: addRssUrl,
    validateUrl: url => validateUrl(url, rssMap),
  });
};

init();
