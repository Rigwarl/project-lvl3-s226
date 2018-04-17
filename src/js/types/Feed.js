// @flow

export type FeedItem = {|
  id: number,
  url: string,
  title: string,
  description: string,
|};

export type ParsedFeed = {|
  title: string,
  description: string,
  items: FeedItem[],
|};

export type Feed = {|
  id: number,
  url: string,
  title: string,
  description: string,
  items: FeedItem[],
|};
