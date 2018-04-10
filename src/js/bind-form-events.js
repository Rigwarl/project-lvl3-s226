const bindFormEvents = ({ $form, validateUrl, onSubmit }) => {
  const $urlInput = $form.find('[name=rss-url]');
  const $urlError = $urlInput.next('.invalid-feedback');

  $urlInput.on('input', () => {
    const val = $urlInput.val();
    const { valid, errorMessage } = validateUrl(val);
    const method = valid ? 'removeClass' : 'addClass';

    $urlInput[method]('is-invalid');
    $urlError.text(errorMessage);
  });

  $form.on('submit', (e) => {
    e.preventDefault();

    const val = $urlInput.val();
    const { valid } = validateUrl(val);

    if (valid) {
      $urlInput.val('');
      onSubmit(val);
    }
  });
};

export default bindFormEvents;
