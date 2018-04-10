const updateForm = ($form, data) => {
  const $urlInput = $form.find('[name=rss-url]');
  const $urlError = $urlInput.next('.invalid-feedback');
  const method = data.valid ? 'removeClass' : 'addClass';

  $urlInput.val(data.value);
  $urlInput[method]('is-invalid');
  $urlError.text(data.errorMessage);
};

export default updateForm;
