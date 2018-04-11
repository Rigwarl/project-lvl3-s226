const updateForm = ($form, {
  formDisabled, formError, urlValid, urlValue,
}) => {
  const $urlInput = $form.find('[name=url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const $submitBtn = $form.find('[type=submit]');

  // check formError for network errors too
  const inputValidClass = (!formError && urlValid) ? 'is-valid' : '';
  const inputInValidClass = formError ? 'is-invalid' : '';

  $urlInput.removeClass(['is-valid', 'is-invalid']);
  $urlInput.addClass(inputValidClass);
  $urlInput.addClass(inputInValidClass);
  $urlInput.prop('disabled', formDisabled);
  $submitBtn.prop('disabled', formDisabled || !urlValid);
  $urlError.text(formError);
  $urlInput.val(urlValue);
};

export default updateForm;
