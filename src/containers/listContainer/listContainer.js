import { connect } from 'react-redux'
import List from '../../components/list/list.js'
import {addItem} from '../../actionCreators/addItem.js';
import {editItem} from '../../actionCreators/editItem.js';
import {reorderItem} from '../../actionCreators/reorderItem.js';
import {removeItem} from '../../actionCreators/removeItem.js';
import {toggleItem} from '../../actionCreators/toggleItem.js';
import {setNowEditing} from '../../actionCreators/setNowEditing.js';
import {setNowDragging} from '../../actionCreators/setNowDragging.js';
import {setNowDraggingFrom} from '../../actionCreators/setNowDraggingFrom.js';
import {setNowDraggingTo} from '../../actionCreators/setNowDraggingTo.js';
import {getListItems} from '../../actionCreators/getListItems.js';

const mapStateToProps = state => {
  return {
    items: state.items,
    sorts: state.sorts,
    nowEditing: state.state.nowEditing,
    nowDragging: state.state.nowDragging,
    nowDraggingFrom: state.state.nowDraggingFrom,
    nowDraggingTo: state.state.nowDraggingTo,
    activeList: state.state.activeList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: (title, createdAt, dueAt, isEvent, listId) => { dispatch(addItem(title, createdAt, dueAt, isEvent, listId)) },
    edit: (title, id) => { dispatch(editItem(title, id)) },
    reorder: (id, from, to, listId) => { dispatch(reorderItem(id, from, to, listId)) },
    remove: (id, listId) => { dispatch(removeItem(id, listId)) },
    onEdit: id => { dispatch(setNowEditing(id)) },
    done: (id, completed) => { dispatch(toggleItem(id, completed)) },
    onDrag: bool => { dispatch(setNowDragging(bool)) },
    onDragFrom: sectionId => { dispatch(setNowDraggingFrom(sectionId)) },
    onDragTo: sectionId => { dispatch(setNowDraggingTo(sectionId)) },
    getListItems: listId => { dispatch(getListItems(listId)) }
  }
}

const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List)

export default ListContainer
