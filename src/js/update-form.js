const updateForm = ($form, {
  formDisabled, formValid, formUrlValue, formUrlError,
}) => {
  const $urlInput = $form.find('[name=url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const $submitBtn = $form.find('[type=submit]');

  // check error field for network errors too
  $urlInput.addClass(formUrlError ? 'is-invalid' : 'is-valid');
  $urlInput.removeClass(formUrlError ? 'is-valid' : 'is-invalid');
  $urlInput.prop('disabled', formDisabled);
  $submitBtn.prop('disabled', formDisabled || !formValid);
  $urlError.text(formUrlError);
  $urlInput.val(formUrlValue);
};

export default updateForm;
