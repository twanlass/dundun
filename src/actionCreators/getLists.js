import _ from 'lodash';
import * as Api from '../helpers/api.js';
import {receiveLists} from './receiveLists.js';
import {setTodayBadgeCount} from './setTodayBadgeCount.js';

export const getLists = () => {
  let lists = Api.getLists()

  return (dispatch) => {
    lists.then(response => {
      response.json().then(response => {
        let lists = response.lists;
        let todayList = _.filter(lists, { 'type': 'today'})[0];

        dispatch(receiveLists(lists))
        dispatch(setTodayBadgeCount(todayList.badge_count))
      })
    })
  };
}
