const updateForm = ($form, {
  disabled, valid, url, error,
}) => {
  const $urlInput = $form.find('[name=url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const $submitBtn = $form.find('[type=submit]');

  $urlInput.val(url);
  $urlError.text(error);
  $urlInput.addClass(valid ? 'is-valid' : 'is-invalid');
  $urlInput.removeClass(valid ? 'is-invalid' : 'is-valid');
  $submitBtn.prop('disabled', disabled);
  $urlInput.prop('disabled', disabled);
};

export default updateForm;
