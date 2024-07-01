import { avatarTransformer } from './avatar.transformer';


describe('Last.fm transformer: avatars', () => {
  it('transforms an array of avatars into an object with the correct keys', () => {
    const avatars = [
      { size: 'small', '#text': 'http://example.com/small.jpg' },
      { size: 'medium', '#text': 'http://example.com/medium.jpg' },
      { size: 'large', '#text': 'http://example.com/large.jpg' },
      { size: 'extralarge', '#text': 'http://example.com/extralarge.jpg' },
    ];

    const result = avatarTransformer(avatars);

    expect(result).toEqual({
      sm: 'http://example.com/small.jpg',
      md: 'http://example.com/medium.jpg',
      lg: 'http://example.com/large.jpg',
      xl: 'http://example.com/extralarge.jpg',
    });
  });

  it('ignores any avatar object with an unknown size', () => {
    const avatars = [
      { size: 'small', '#text': 'http://example.com/small.jpg' },
      { size: 'unknown', '#text': 'http://example.com/unknown.jpg' },
      { size: 'large', '#text': 'http://example.com/large.jpg' },
    ];

    const result = avatarTransformer(avatars);

    expect(result).toEqual({
      sm: 'http://example.com/small.jpg',
      lg: 'http://example.com/large.jpg',
    });
  });

  it('returns a null object if no avatars are provided', () => {
    const result = avatarTransformer([]);

    expect(result).toBeNull();
  });
});
