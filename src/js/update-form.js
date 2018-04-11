const updateForm = ($form, { feedStatus, feedError, feedUrl }) => {
  const $urlInput = $form.find('[name=url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const $submitBtn = $form.find('[type=submit]');

  const inputClassName = {
    loading: '',
    empty: '',
    valid: 'is-valid',
    error: 'is-invalid',
  }[feedStatus];

  $urlInput.removeClass(['is-valid', 'is-invalid']);
  $urlInput.addClass(inputClassName);

  $urlInput.prop('disabled', feedStatus === 'loading');
  $submitBtn.prop('disabled', feedStatus === 'loading');

  $urlError.text(feedError);
  $urlInput.val(feedUrl);
};

export default updateForm;
