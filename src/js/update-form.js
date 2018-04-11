const updateForm = ($form, { formStatus, formError, feedUrl }) => {
  const $urlInput = $form.find('[name=url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const $submitBtn = $form.find('[type=submit]');

  const inputClassName = {
    disabled: '',
    empty: '',
    valid: 'is-valid',
    error: 'is-invalid',
  }[formStatus];

  $urlInput.removeClass(['is-valid', 'is-invalid']);
  $urlInput.addClass(inputClassName);

  $urlInput.prop('disabled', formStatus === 'disabled');
  $submitBtn.prop('disabled', formStatus === 'disabled');

  $urlError.text(formError);
  $urlInput.val(feedUrl);
};

export default updateForm;
