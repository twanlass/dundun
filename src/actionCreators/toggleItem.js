import * as Api from '../helpers/api.js';
import { TOGGLE_ITEM } from '../actionTypes/actionTypes.js';
import Moment from 'moment';

const toggle = id => {
  return {
    type: TOGGLE_ITEM,
    id,
    completed_at: Moment().valueOf()
  }
}

export const toggleItem = (id, completed) => {
  // Create API fetch / promise
  let item = Api.updateListItem({id, completed})

  return (dispatch) => {
    // Immediately toggle item in client collection
    dispatch(toggle(id, completed));

    // Await API call response
    item.then(response => {
      response.json().then(response => {
        // @todo handle errors
      })
    })
  };
}
