const createItem = (feedId, { id, url, title }) =>
  `<li class="mb-2">
    <a href=${url} class="mr-1">${title}</a>
    <button
      class="btn btn-sm btn-primary"
      data-feed-id=${feedId}
      data-item-id=${id}
      data-toggle="modal"
      data-target="#rss-modal"
    >more</button>
  </li>`;

const updateRss = ($element, rssArr) => {
  const tabs = rssArr.map(({ id, title, description }) =>
    `<a 
      class="list-group-item list-group-item-action"
      href="#rss-feed-${id}"
      data-toggle="list"
    >
      <h2 class="h5">${title}</h2>
      <div>${description}</div>
    </a>`).join('');

  const tabPanes = rssArr.map(({ id, items }) =>
    `<ul class="tab-pane" id="rss-feed-${id}">
      ${items.map(item => createItem(id, item)).join('')}
    </ul>`).join('');

  const activeItemHref = $element.find('.active').first().attr('href') || '#rss-feed-0';

  $element.html(`
    <div class="col-4">
      <div class="list-group">${tabs}</div>
    </div>
    <div class="col-8">
      <div class="tab-content">${tabPanes}</div>
    </div>
  `);

  $element.find(activeItemHref).addClass('active');
  $element.find(`[href="${activeItemHref}"]`).addClass('active');
};

export default updateRss;
