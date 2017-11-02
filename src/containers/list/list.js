import { connect } from 'react-redux'
import List from '../../components/list/list.js'

import {addTodo} from '../../actionCreators/addTodo.js';
import {editTodo} from '../../actionCreators/editTodo.js';
import {moveTodo} from '../../actionCreators/moveTodo.js';
import {removeTodo} from '../../actionCreators/removeTodo.js';
import {toggleTodo} from '../../actionCreators/toggleTodo.js';
import {setNowEditing} from '../../actionCreators/setNowEditing.js';
import {setNowDragging} from '../../actionCreators/setNowDragging.js';
import {setNowDraggingFrom} from '../../actionCreators/setNowDraggingFrom.js';
import {setNowDraggingTo} from '../../actionCreators/setNowDraggingTo.js';

const mapStateToProps = state => {
  return {
    items: state.items,
    nowEditing: state.state.nowEditing,
    nowDragging: state.state.nowDragging,
    nowDraggingFrom: state.state.nowDraggingFrom,
    nowDraggingTo: state.state.nowDraggingTo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: (title, due_at, is_event) => { dispatch(addTodo(title, due_at, is_event)) },
    edit: (title, id) => { dispatch(editTodo(title, id)) },
    move: (from, to) => { dispatch(moveTodo(from, to)) },
    remove: id => { dispatch(removeTodo(id)) },
    onEdit: id => { dispatch(setNowEditing(id)) },
    done: id => { dispatch(toggleTodo(id)) },
    onDrag: bool => { dispatch(setNowDragging(bool)) },
    onDragFrom: sectionId => { dispatch(setNowDraggingFrom(sectionId)) },
    onDragTo: sectionId => { dispatch(setNowDraggingTo(sectionId)) }
  }
}

const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List)

export default ListContainer
