import {
  SETTINGS_UPDATE,
  SETTINGS_MODAL_OPEN,
  SETTINGS_MODAL_CLOSE,
  USER_LOGGED_OUT,
} from 'Constants';

const initialState = {
  lang: 'auto',
  use12Hours: false,
  catchPaste: true,
  isDonor: false,
  keepOriginalTimestamp: true,
  modalIsOpen: false,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTINGS_UPDATE:
      return {
        ...initialState,
        ...state,
        ...action.payload,
      };

    case SETTINGS_MODAL_OPEN:
      return {
        ...initialState,
        modalIsOpen: true,
      };

    case SETTINGS_MODAL_CLOSE:
      return {
        ...initialState,
        modalIsOpen: false,
      };

    case USER_LOGGED_OUT:
      return {
        ...initialState,
        lang: state.lang,
        isDonor: false,
      };

    default:
      return state;
  }
};

export default settingsReducer;
