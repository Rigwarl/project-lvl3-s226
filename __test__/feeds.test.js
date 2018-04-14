import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';
import timer from 'timer-promise';
import axios from 'axios';

import run from '../src/js/application';

const initHtml = fs.readFileSync(path.join(__dirname, '../src/template.html')).toString();
const hexletFeed = fs.readFileSync(path.join(__dirname, './feeds/hexlet.xml')).toString();
const abcFeed = fs.readFileSync(path.join(__dirname, './feeds/abc.xml')).toString();
const abcFeedUpdated = fs.readFileSync(path.join(__dirname, './feeds/abc-updated.xml')).toString();

const inputEvent = new Event('input', { bubbles: true });
const getTree = () => html(document.body.innerHTML);
const pause = async () => {
  const t = timer.start(100);
  jest.runOnlyPendingTimers();
  return t;
};

beforeAll(() => {
  document.documentElement.innerHTML = initHtml;
  run();
});

jest.mock('axios');
jest.useFakeTimers();

test('feeds', async () => {
  const resp = {
    'abc.url': abcFeed,
    'hexlet.url': hexletFeed,
  };
  axios.get.mockImplementation(url => Promise.resolve({ data: resp[url] }));

  const form = document.querySelector('#rss-form');
  const urlInput = form.querySelector('[data-selector="url-input"]');
  const submitBtn = form.querySelector('[data-selector="submit"]');

  // 1 loaded feed
  urlInput.value = 'hexlet.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  await pause();
  expect(getTree()).toMatchSnapshot();

  // 2 another loaded feed
  urlInput.value = 'abc.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  await pause();
  expect(getTree()).toMatchSnapshot();

  // 3 show modal
  const itemBtn = document.querySelector('[data-target="#rss-modal"]');
  itemBtn.click();
  await pause();
  expect(getTree()).toMatchSnapshot();

  // 4 close modal
  const closeBtn = document.querySelector('#rss-modal [data-dismiss="modal"]');
  closeBtn.click();
  await pause();
  expect(getTree()).toMatchSnapshot();

  // 5 tab change
  const tabLinks = document.querySelectorAll('[data-toggle="list"]');
  tabLinks[tabLinks.length - 1].click();
  await pause();
  expect(getTree()).toMatchSnapshot();

  // 6 reload
  resp['abc.url'] = abcFeedUpdated;
  await pause();
  expect(getTree()).toMatchSnapshot();
});
