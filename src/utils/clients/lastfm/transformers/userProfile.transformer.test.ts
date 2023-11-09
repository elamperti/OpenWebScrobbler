import { userProfileTransformer } from './userProfile.transformer';

describe('userProfileTransformer', () => {
  it('should return an object with the expected properties when given a valid response', () => {
    const response = {
      data: {
        user: {
          name: 'UnOc2',
          url: 'https://www.last.fm/user/UnOc2',
          image: [
            {
              size: 'small',
              '#text': 'https://lastfm.freetls.fastly.net/i/u/34s/29445371e4f2060e20f396eaea3b773a.jpg',
            },
            {
              size: 'medium',
              '#text': 'https://lastfm.freetls.fastly.net/i/u/64s/29445371e4f2060e20f396eaea3b773a.jpg',
            },
          ],
        },
      },
    };

    const expectedOutput = {
      name: 'UnOc2',
      url: 'https://www.last.fm/user/UnOc2',
      avatar: {
        sm: 'https://lastfm.freetls.fastly.net/i/u/34s/29445371e4f2060e20f396eaea3b773a.jpg',
        md: 'https://lastfm.freetls.fastly.net/i/u/64s/29445371e4f2060e20f396eaea3b773a.jpg',
      },
    };

    expect(userProfileTransformer(response)).toEqual(expectedOutput);
  });

  it('should return an object with empty strings when given a response with missing data', () => {
    const response = {
      data: {},
    };

    const expectedOutput = {
      name: '',
      url: '',
      avatar: null,
    };

    expect(userProfileTransformer(response)).toEqual(expectedOutput);
  });

  it('should have an empty string if the image array is missing', () => {
    const response = {
      data: {
        user: {
          name: 'UnOc2',
          url: 'https://www.last.fm/user/UnOc2',
        },
      },
    };

    const expectedOutput = {
      name: 'UnOc2',
      url: 'https://www.last.fm/user/UnOc2',
      avatar: null,
    };

    expect(userProfileTransformer(response)).toEqual(expectedOutput);
  });
});
