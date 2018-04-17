// @flow

import type { Feed } from './Feed';

export type State = {|
  feeds: Feed[],
  feedId: number,
  feedUrl: string,
  feedError: string,
  feedStatus: 'empty' | 'error' | 'valid' | 'loading',
|};
