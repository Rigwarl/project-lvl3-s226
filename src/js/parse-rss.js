import $ from 'jquery';

const parseItem = (item) => {
  const $item = $(item);

  return {
    title: $item.find('title').text(),
    url: $item.find('link').text(),
  };
};

const parseRss = (string) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(string, 'application/xml');
  const $xml = $(xml);

  return {
    title: $xml.find('channel > title').text(),
    description: $xml.find('channel > description').text(),
    items: $xml.find('channel > item').get().map(parseItem),
  };
};

export default parseRss;
