const initialState = {
  newVersionReady: false,
};

const updatesReducer = (state=initialState, action) => {
  switch (action.type) {
    case 'NEW_VERSION_READY':
      return {
        ...initialState,
        newVersionReady: true,
      };

    default:
      return state;
  }
};

export default updatesReducer;
