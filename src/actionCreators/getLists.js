import * as Api from '../helpers/api.js';
import {receiveLists} from './receiveLists.js';

export const getLists = () => {
  let lists = Api.getLists()

  return (dispatch) => {
    lists.then(response => {
      response.json().then(response => {
        let lists = response.lists;
        let meta = response.meta;

        dispatch(receiveLists(lists, meta.sort_order))
      })
    })
  };
}
