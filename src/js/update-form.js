const updateForm = ($form, {
  formDisabled, formValid, formValue, formError,
}) => {
  const $urlInput = $form.find('[name=url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const $submitBtn = $form.find('[type=submit]');

  // check error field for network errors too
  $urlInput.addClass(formError ? 'is-invalid' : 'is-valid');
  $urlInput.removeClass(formError ? 'is-valid' : 'is-invalid');
  $urlInput.prop('disabled', formDisabled);
  $submitBtn.prop('disabled', formDisabled || !formValid);
  $urlError.text(formError);
  $urlInput.val(formValue);
};

export default updateForm;
