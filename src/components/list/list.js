import React from 'react';
import _ from 'lodash';
import ListSingle from './listSingle.js'

export default class List extends React.Component {
  // @todo move to listContainer?
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeList !== this.props.activeList) {
      this.props.getListItems(nextProps.activeList)
    }
  }

  list(listId) {
    let list = _.filter(this.props.lists, { 'id': listId})[0]
    // return list type component to render (single, group, etc)
    return list.type;
  }

  render() {
    const {activeList} = this.props;

    if (activeList) {
      // conditional return based on list type
      // this.list(activeList)
      return (
        <ListSingle {...this.props}/>
      )
    } else {
      return null;
    }
  }
}
