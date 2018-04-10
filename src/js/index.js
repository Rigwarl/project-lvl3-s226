import $ from 'jquery';
import checkUrl from './url-checker';
import createFormController from './form-controller';

const init = () => {
  const rssMap = new Map();

  const onSubmit = (url) => {
    rssMap.set(url, []);
  };

  createFormController({
    form: $('#rss-form'),
    checkUrl: url => checkUrl(url, rssMap),
    onSubmit,
  });
};

init();
