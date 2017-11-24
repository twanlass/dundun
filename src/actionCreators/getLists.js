import fetch from 'isomorphic-fetch';
import * as Api from '../helpers/api.js';
import {receiveLists} from './receiveLists.js';

export const getLists = () => {
  let lists = Api.getLists()

  return (dispatch) => {
    lists.then(response => {
      response.json().then(response => {
        dispatch(receiveLists(response.lists))
      })
    })
  };
}
