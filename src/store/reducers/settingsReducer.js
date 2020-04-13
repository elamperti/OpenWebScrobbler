import {
  SETTINGS_UPDATE,
  USER_LOGGED_OUT,
} from 'Constants'

const initialState = {
  lang: 'auto',
  use12Hours: false,
  catchPaste: true,
  isDonor: false,
  keepOriginalTimestamp: true,
}

const settingsReducer = (state=initialState, action) => {
  switch (action.type) {
    case SETTINGS_UPDATE:
      return {
        ...initialState,
        ...state,
        ...action.payload,
      }

    case USER_LOGGED_OUT:
      return {
        ...initialState,
        lang: state.lang,
      }

    default:
      return state
  }
}

export default settingsReducer
