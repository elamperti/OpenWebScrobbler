const initialState = {
  isLoggedIn: null,
  name: '',
  url: '',
  country: '',
  avatarURL: '',
};

const userReducer = (state=initialState, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: true,
      }

    case 'USER_LOGGED_OUT':
      return {
          isLoggedIn: false,
          name: '',
          url: '',
          country: '',
          avatarURL: '',
      }

    case 'USER_GET_INFO_FULFILLED':
      if (action.payload.data.user) {
        let userData = action.payload.data.user;
        return {
          ...state,
          isLoggedIn: true,
          name: userData.name || '',
          url: userData.url || '',
          country: userData.country || '',
          avatarURL: userData.image ? userData.image[1]['#text'] : '',
        }
      } else if (action.payload.data.hasOwnProperty('isLoggedIn')) {
        return {
          ...state,
          isLoggedIn: action.payload.data.isLoggedIn,
        }
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default userReducer;
