// @flow

import $ from 'jquery';

import type { ParsedFeed, FeedItem } from './types/Feed';

const parseItem = (item, i): FeedItem => {
  const $item = $(item);

  return {
    id: i,
    url: $item.find('link').text(),
    title: $item.find('title').text(),
    description: $item.find('description').text(),
  };
};

const parseRss = (rss: string): ParsedFeed => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(rss, 'application/xml');
  const $xml = $(xml);

  return {
    title: $xml.find('channel > title').text(),
    description: $xml.find('channel > description').text(),
    items: $xml.find('channel > item').get().map(parseItem),
  };
};

export default parseRss;
