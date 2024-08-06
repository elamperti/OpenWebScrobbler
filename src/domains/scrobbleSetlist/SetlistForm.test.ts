import { extractSetlistID } from './SetlistForm';

describe('`extractSetlistID` helper', () => {
  it('extracts setlistID from text', () => {
    const text = 'https://www.setlist.fm/setlist/chappell-roan/2024/grant-park-chicago-il-5babebec.html';
    const result = extractSetlistID(text);
    expect(result).toEqual('5babebec');
  });
});
