import { userTransformer } from './user.transformer';

describe('userTransformer', () => {
  it('transforms a full response correctly', () => {
    const raw = {
      token: 'abc123',
      user: {
        id: '42',
        name: 'Sufjan',
        url: 'https://example.com/sufjan',
        image: [
          { size: 'small', '#text': 'sm.jpg' },
          { size: 'medium', '#text': 'md.jpg' },
        ],
      },
      isLoggedIn: true,
    };

    expect(userTransformer(raw)).toEqual({
      token: 'abc123',
      user: {
        id: '42',
        name: 'Sufjan',
        avatar: { sm: 'sm.jpg', md: 'md.jpg' },
        url: 'https://example.com/sufjan',
      },
      isLoggedIn: true,
    });
  });

  it('infers logged in state when missing flag', () => {
    const raw = {
      user: {
        name: 'Kurt Cobain',
      },
    };

    expect(userTransformer(raw).isLoggedIn).toBe(true);
  });
});
