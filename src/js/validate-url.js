import isURL from 'validator/lib/isURL';

const validateUrl = (url, existsMap) => {
  if (url === '') {
    return {
      valid: false,
      errorMessage: 'Empty URL',
    };
  }

  if (!isURL(url)) {
    return {
      valid: false,
      errorMessage: 'Invalid URL',
    };
  }

  if (existsMap.has(url)) {
    return {
      valid: false,
      errorMessage: 'This URL already exists.',
    };
  }

  return {
    valid: true,
    errorMessage: '',
  };
};

export default validateUrl;
