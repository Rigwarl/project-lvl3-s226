import $ from 'jquery';
import axios from 'axios';

import bindFormEvents from './bind-form-events';
import checkUrl from './check-url';
import parseRss from './parse-rss';

const init = () => {
  const rssMap = new Map();
  const $form = $('#rss-form');

  const addRss = (url) => {
    rssMap.set(url, []);
    axios.get(`https://crossorigin.me/${url}`)
      .then(res => parseRss(res.data))
      .then(res => console.log(res));
  };

  bindFormEvents({
    $form,
    onSubmit: addRss,
    checkUrl: url => checkUrl(url, rssMap),
  });
};

init();
