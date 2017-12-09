import * as Api from '../helpers/api.js';
import { EDIT_ITEM } from '../actionTypes/actionTypes.js';

const edit = (title, id) => {
  return {
    type: EDIT_ITEM,
    id,
    item: {
      title
    }
  }
}

export const editItem = (title, id) => {
  return (dispatch) => {
    // Update via API
    Api.updateListItem({id, title})

    // Immediately edit item in client collection
    dispatch(edit(title, id));
  };
}
