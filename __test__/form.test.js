import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';

import run from '../src/js/application';

const initHtml = fs.readFileSync(path.join(__dirname, '../src/template.html')).toString();
const getTree = () => html(document.body.innerHTML);

beforeAll(() => {
  document.documentElement.innerHTML = initHtml;
  run();
});

test('form', () => {
  expect(getTree()).toMatchSnapshot();
});
