import isURL from 'validator/lib/isURL';

const checkUrl = (url, existsMap) => {
  if (url === '') {
    return 'empty';
  }

  if (!isURL(url)) {
    return 'invalid';
  }

  if (existsMap.has(url)) {
    return 'exists';
  }

  return 'ok';
};

export default checkUrl;
