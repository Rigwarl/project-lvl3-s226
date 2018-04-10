import $ from 'jquery';
import axios from 'axios';
import checkUrl from './check-url';
import createFormController from './create-form-controller';

const init = () => {
  const proxy = 'https://crossorigin.me';
  const rssMap = new Map();

  const form = $('#rss-form');

  const addRss = (url) => {
    rssMap.set(url, []);
    axios.get(`${proxy}/${url}`)
      .then(res => console.log(res));
  };

  createFormController({
    form,
    onSubmit: addRss,
    checkUrl: url => checkUrl(url, rssMap),
  });
};

init();
