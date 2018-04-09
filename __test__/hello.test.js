import getHello from '../src';

test('hello world', () => {
  expect(getHello()).toEqual('Hello World!');
});
