import { connect } from 'react-redux'
import List from '../../components/list/list.js'
import {addItem} from '../../actionCreators/addItem.js';
import {editItem} from '../../actionCreators/editItem.js';
import {snoozeItem} from '../../actionCreators/snoozeItem.js';
import {reorderItem} from '../../actionCreators/reorderItem.js';
import {removeItem} from '../../actionCreators/removeItem.js';
import {toggleItem} from '../../actionCreators/toggleItem.js';
import {setNowEditing} from '../../actionCreators/setNowEditing.js';
import {setNowCompleting} from '../../actionCreators/setNowCompleting.js';
import {setNowDragging} from '../../actionCreators/setNowDragging.js';
import {setNowDraggingTo} from '../../actionCreators/setNowDraggingTo.js';
import {getListItems} from '../../actionCreators/getListItems.js';

const mapStateToProps = state => {
  return {
    items: state.items,
    itemOrder: state.itemOrder,
    lists: state.lists,
    activeList: state.state.activeList,
    nowEditing: state.state.nowEditing,
    nowCompleting: state.state.nowCompleting,
    nowDragging: state.state.nowDragging,
    nowDraggingTo: state.state.nowDraggingTo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: (title, createdAt, dueAt, isEvent, listId) => { dispatch(addItem(title, createdAt, dueAt, isEvent, listId)) },
    edit: (title, id) => { dispatch(editItem(title, id)) },
    snooze: (id, dueAt, listId) => { dispatch(snoozeItem(id, dueAt, listId)) },
    done: (id, listId, completed) => { dispatch(toggleItem(id, listId, completed)) },
    reorder: (id, from, to, listId) => { dispatch(reorderItem(id, from, to, listId)) },
    remove: (id, listId) => { dispatch(removeItem(id, listId)) },
    onEdit: id => { dispatch(setNowEditing(id)) },
    onDone: id => { dispatch(setNowCompleting(id)) },
    onDrag: bool => { dispatch(setNowDragging(bool)) },
    onDragTo: sectionId => { dispatch(setNowDraggingTo(sectionId)) },
    getListItems: listId => { dispatch(getListItems(listId)) }
  }
}

const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List)

export default ListContainer
