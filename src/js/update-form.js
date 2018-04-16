// @flow

import type { State } from './types/State';

const updateForm = ($form: JQuery, { feedStatus, feedError, feedUrl }: State): void => {
  const $urlInput = $form.find('[data-selector=url-input]');
  const $urlError = $form.find('[data-selector=url-error]');
  const $submitBtn = $form.find('[data-selector=submit]');

  const inputClassName = {
    loading: '',
    empty: '',
    valid: 'is-valid',
    error: 'is-invalid',
  }[feedStatus];

  $urlInput.removeClass('is-valid');
  $urlInput.removeClass('is-invalid');
  $urlInput.addClass(inputClassName);

  $urlInput.prop('disabled', feedStatus === 'loading');
  $submitBtn.prop('disabled', feedStatus === 'loading');

  $urlError.text(feedError);
  $urlInput.val(feedUrl);
};

export default updateForm;
