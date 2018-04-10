const messages = {
  empty: 'Empty URL',
  exists: 'This URL already exists.',
  invalid: 'Invalid URL',
};

const createFormController = ({ form, checkUrl, onSubmit }) => {
  const urlInput = form.find('[name=rss-url]');
  const urlError = urlInput.next('.invalid-feedback');

  urlInput.on('input', () => {
    const result = checkUrl(urlInput.val());

    if (result === 'ok') {
      urlInput.removeClass('is-invalid');
    } else {
      urlInput.addClass('is-invalid');
      urlError.text(messages[result]);
    }
  });

  form.on('submit', (e) => {
    e.preventDefault();

    const result = checkUrl(urlInput.val());

    if (result === 'ok') {
      onSubmit(urlInput.val());
      urlInput.val('');
    }
  });
};

export default createFormController;
