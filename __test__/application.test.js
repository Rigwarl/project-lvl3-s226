import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';
import timer from 'timer-promise';
import axios from 'axios';

import run from '../src/js/application';

const initHtml = fs.readFileSync(path.join(__dirname, '../src/template.html')).toString();
const hexletFeed = fs.readFileSync(path.join(__dirname, './feeds/hexlet.xml')).toString();
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

  // ready
  expect(getTree()).toMatchSnapshot();

  // invalid
  urlInput.value = 'invalid url';
  urlInput.dispatchEvent(inputEvent);
  expect(getTree()).toMatchSnapshot();

  // empty
  urlInput.value = '';
  urlInput.dispatchEvent(inputEvent);
  expect(getTree()).toMatchSnapshot();

  // valid
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  expect(getTree()).toMatchSnapshot();

  // disabled
  axios.get.mockRejectedValue();
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  expect(getTree()).toMatchSnapshot();

  // error
  await timer.start(100);
  expect(getTree()).toMatchSnapshot();

  // loaded feed
  axios.get.mockResolvedValue({ data: hexletFeed });
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  await timer.start(100);
  expect(getTree()).toMatchSnapshot();

  // exists
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  expect(getTree()).toMatchSnapshot();
});

