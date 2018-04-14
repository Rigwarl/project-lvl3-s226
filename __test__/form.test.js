import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';
import timer from 'timer-promise';
import axios from 'axios';

import run from '../src/js/application';

const initHtml = fs.readFileSync(path.join(__dirname, '../src/template.html')).toString();

const inputEvent = new Event('input', { bubbles: true });
const getTree = () => html(document.body.innerHTML);

beforeAll(() => {
  document.documentElement.innerHTML = initHtml;
  run();
});

jest.mock('axios');

test('form', async () => {
  const form = document.querySelector('#rss-form');
  const urlInput = form.querySelector('[data-selector="url-input"]');
  const submitBtn = form.querySelector('[data-selector="submit"]');

  // 1 ready
  expect(getTree()).toMatchSnapshot();

  // 2 invalid
  urlInput.value = 'invalid url';
  urlInput.dispatchEvent(inputEvent);
  expect(getTree()).toMatchSnapshot();

  // 3 empty
  urlInput.value = '';
  urlInput.dispatchEvent(inputEvent);
  expect(getTree()).toMatchSnapshot();

  // 4 valid
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  expect(getTree()).toMatchSnapshot();

  // 5 disabled
  axios.get.mockRejectedValue();
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  expect(getTree()).toMatchSnapshot();

  // 6 error
  await timer.start(100);
  expect(getTree()).toMatchSnapshot();

  // 7 loaded empty feed
  axios.get.mockResolvedValue({ data: {} });
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  await timer.start(100);
  expect(getTree()).toMatchSnapshot();

  // 8 exists
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  expect(getTree()).toMatchSnapshot();
});
