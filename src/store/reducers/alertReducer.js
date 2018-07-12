import shortid from 'shortid';

const initialState = [];

/*
  Alert properties for humans:
  An alert is assigned an UUID automatically (`id`).
  The `type` specifies a bootstrap style (in the future will be severity).
  The `category` may group several alerts (by repetition).
  The `title` and `message` are self explanatory.
  `icon` may be deprecated in favor of defaults for each `type`.
  The alerts marked with `persistent` won't be cleared after a route change.
*/

const alertReducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ALERT_CLEAR_ALL':
      return state.filter((alert) => {
        return alert.persistent;
      });

    case 'ALERT_CREATE':
      return [
        {
          id: shortid.generate(),
          category: action.payload.category || '',
          type: action.payload.type || 'secondary', // ToDo: map payload.type to available types
          title: action.payload.title || '',
          errorNumber: action.payload.errorNumber || null,
          message: action.payload.message,
          rawMessage: action.payload.rawMessage,
          icon: action.payload.icon || null,
          persistent: action.payload.persistent || false,
        },
        ...state.filter(alert => {
          if (action.payload.category && alert.category) {
            return (alert.category !== action.payload.category);
          }
          return true;
        })
      ];

    case 'ALERT_DISMISS':
      return state.filter(alert => {
        for (let key in action.payload) {
          if (alert[key] !== action.payload[key]) {
            return true;
          }
        }
        return false;
      });

    default:
      return state;
  }
};

export default alertReducer;
