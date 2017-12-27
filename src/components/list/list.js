import React from 'react';
import _ from 'lodash';
import ListSingle from './listSingle.js'
import ListGroup from './listGroup.js'
import ListDone from './listDone.js'

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

  // @todo - rename list types: flat, section
  // See react native components and composition style (pass in data)
  render() {
    const {lists, activeList} = this.props;

    if (activeList) {
      let listTitle = lists[activeList].title

      if (listTitle === 'upcoming') {
        return (
          <ListGroup {...this.props}/>
        )
      } else if (listTitle === 'done') {
        return (
          <ListDone {...this.props}/>
        )
      } else {
        return (
          <ListSingle {...this.props}/>
        )
      }
    } else {
      return null;
    }
  }
}
