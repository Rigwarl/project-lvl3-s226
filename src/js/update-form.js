const updateForm = ($form, {
  disabled, valid, url, error,
}) => {
  const $urlInput = $form.find('[name=url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const $submitBtn = $form.find('[type=submit]');

  // check error field for network errors too
  $urlInput.addClass(error ? 'is-invalid' : 'is-valid');
  $urlInput.removeClass(error ? 'is-valid' : 'is-invalid');
  $urlInput.prop('disabled', disabled);
  $submitBtn.prop('disabled', disabled || !valid);
  $urlError.text(error);
  $urlInput.val(url);
};

export default updateForm;
