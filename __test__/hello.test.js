import getHello from '../src/index';

test('hello world', () => {
  expect(getHello()).toEqual('Hello World!');
});
