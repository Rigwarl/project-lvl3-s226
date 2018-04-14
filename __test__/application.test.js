import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';
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

test('form', () => {
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
  axios.get.mockResolvedValue({ data: '' });
  urlInput.value = 'valid.url';
  urlInput.dispatchEvent(inputEvent);
  submitBtn.click();
  expect(getTree()).toMatchSnapshot();
});
