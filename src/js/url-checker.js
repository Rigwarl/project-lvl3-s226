import isURL from 'validator/lib/isURL';

const validateUrl = (url, existsMap) => {
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

export default validateUrl;
