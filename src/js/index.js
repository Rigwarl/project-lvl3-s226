import $ from 'jquery';
import axios from 'axios';

import parseRss from './parse-rss';
import validateUrl from './validate-url';
import bindFormEvents from './bind-form-events';

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
    validateUrl: url => validateUrl(url, rssMap),
  });
};

init();
