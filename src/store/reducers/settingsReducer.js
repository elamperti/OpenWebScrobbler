const initialState = {
  lang: 'auto',
  use12Hours: false,
  catchPaste: true,
  isDonor: false,
};

const settingsReducer = (state=initialState, action) => {
  switch (action.type) {
    case 'SETTINGS_UPDATE':
      return {
        ...state,
        lang: action.payload.lang || initialState.lang,
        use12Hours: !!action.payload.use12Hours || initialState.use12Hours,
        catchPaste: !!action.payload.catchPaste || initialState.catchPaste,
        isDonor: !!action.payload.isDonor || initialState.isDonor,
      };

    case 'USER_LOGGED_OUT':
      return {
        ...initialState,
        lang: state.lang,
      };

    default:
      return state;
  }
};

export default settingsReducer;
