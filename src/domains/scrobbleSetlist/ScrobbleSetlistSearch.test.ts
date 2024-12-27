import { extractSetlistID } from './ScrobbleSetlistSearch';

describe('`extractSetlistID` helper', () => {
  it('extracts setlistID from text', () => {
    const text = 'https://www.setlist.fm/setlist/chappell-roan/2024/grant-park-chicago-il-5babebec.html';
    const result = extractSetlistID(text);
    expect(result).toEqual('5babebec');
  });

  it('extracts setlistID of varying length from URL', () => {
    const text = 'https://www.setlist.fm/setlist/maggie-rogers/2024/madison-square-garden-new-york-ny-ba97d62.html';
    const result = extractSetlistID(text);
    expect(result).toEqual('ba97d62');
  });

  it('fails to get an ID for a random text', () => {
    const text = 'Lorem ipsum';
    const result = extractSetlistID(text);
    expect(result).toEqual(null);
  });
});
