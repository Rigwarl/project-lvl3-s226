// @flow

import isURL from 'validator/lib/isURL';

const validateUrl = (url: string, existUrls: string[]): { valid: boolean, error: string } => {
  if (url === '') {
    return {
      valid: false,
      error: 'Empty URL',
    };
  }

  if (!isURL(url)) {
    return {
      valid: false,
      error: 'Invalid URL',
    };
  }

  if (existUrls.includes(url)) {
    return {
      valid: false,
      error: 'This URL already exists',
    };
  }

  return {
    valid: true,
    error: '',
  };
};

export default validateUrl;
