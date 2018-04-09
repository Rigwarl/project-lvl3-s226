import getHello from '../src/js';

test('hello world', () => {
  expect(getHello()).toEqual('Hello World!');
});
