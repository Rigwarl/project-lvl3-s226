const updateForm = ($form, { valid, value, error }) => {
  const $urlInput = $form.find('[name=url]');
  const $submitBtn = $form.find('[name=submit]');
  const $urlError = $urlInput.next('.invalid-feedback');

  $urlInput.addClass(valid ? 'is-valid' : 'is-invalid');
  $urlInput.removeClass(valid ? 'is-invalid' : 'is-valid');
  $urlInput.val(value);
  $urlError.text(error);
  $submitBtn.prop('disabled', !valid);
};

export default updateForm;
