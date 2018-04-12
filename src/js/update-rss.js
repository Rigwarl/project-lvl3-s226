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
  const tabs = rssArr.map(({ id, title, description }, i) =>
    `<a 
      class="list-group-item list-group-item-action ${i === 0 ? 'active' : ''}"
      href="#rss-feed-${id}"
      data-toggle="list"
    >
      <h2 class="h5">${title}</h2>
      <div>${description}</div>
    </a>`).join('');

  const tabPanes = rssArr.map(({ id, items }, i) =>
    `<ul class="tab-pane ${i === 0 ? 'active' : ''}" id="rss-feed-${id}">
      ${items.map(item => createItem(id, item)).join('')}
    </ul>`).join('');

  $element.html(`
    <div class="col-4">
      <div class="list-group" role="tab">${tabs}</div>
    </div>
    <div class="col-8">
      <div class="tab-content">${tabPanes}</div>
    </div>
  `);
};

export default updateRss;
