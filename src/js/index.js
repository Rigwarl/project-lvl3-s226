import $ from 'jquery';
import axios from 'axios';
import bindFormEvents from './bind-form-events';
import checkUrl from './check-url';

const init = () => {
  const proxy = 'https://crossorigin.me';
  const rssMap = new Map();

  const $form = $('#rss-form');

  const addRss = (url) => {
    rssMap.set(url, []);
    axios.get(`${proxy}/${url}`)
      .then(res => console.log(res));
  };

  bindFormEvents({
    $form,
    onSubmit: addRss,
    checkUrl: url => checkUrl(url, rssMap),
  });
};

init();
