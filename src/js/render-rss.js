const renderRss = ($element, rssArr) => {
  const tabs = rssArr.map((feed, i) =>
    `<a 
      class="list-group-item list-group-item-action ${i === 0 ? 'active' : ''}"
      href="#rss-feed-${i}"
      data-toggle="list"
    >
      <h2 class="h5">${feed.title}</h2>
      <div>${feed.description}</div>
    </a>`).join('');

  const tabPanes = rssArr.map(({ items }, i) =>
    `<ul class="tab-pane ${i === 0 ? 'active' : ''}" id="rss-feed-${i}">
      ${items.map(item => `<li><a href=${item.url}>${item.title}</a></li>`).join('')}
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

export default renderRss;
