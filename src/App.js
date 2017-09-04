// @todo notes
// recurring tasks
// task notes, sub-tasks
// sorting / big rocks / grouping of cal items?
// show Dones by date (similar to a logbook)
// Allow editing to add dates (re-parse text, add dueAt prop)
// Auto-link text: https://github.com/OpenGov/react-autolink-text
// Emojify text: https://github.com/banyan/react-emoji
// Animation: https://github.com/reactjs/react-transition-group/tree/v1-stable
// Create sub tasks by comma, i.e. "pricing experiement: paper, update designs, setup call"
// Keyboard editing up / down, enter, e to close archive

import React from 'react';
import Moment from 'moment';
import _ from 'lodash';
import chrono from 'chrono-node';
import { CSSTransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import './App.css';

const Title = ({ todoCount }) => {
  return (
      <div className="title">Todos</div>
  );
};

const TodoListDebugOptions = ({showDebug, updateDataStruct, resetData}) => {
  if (showDebug) {
    return (
      <div className="todo-list-options">
        <button onClick={() => {updateDataStruct()}}>update data struct</button>
        <button onClick={() => {resetData()}}>reset todo data</button>
      </div>
    )
  } else {
    return null;
  }
}

const TodoListOptions = ({showDone, toggleShowDone}) => {
  return (
    <div className="todo-list-options">
      <label>Show Dones?
        <input type="checkbox" defaultChecked={showDone} onClick={() => {
          toggleShowDone();
        }} />
      </label>
    </div>
  )
}

const TodoForm = ({ add }) => {
  let input;

  return (
    <div className="todo todo--add">
      <form
        onSubmit={e => {
          e.preventDefault();
          add(input.value);
          input.value = "";
        }}
      >
        <label>
          <input type="checkbox" disabled="disabled" />
        </label>
        <input
          className="todo__add"
          placeholder="Add a new todo..."
          autoFocus={true}
          ref={node => {
            input = node;
          }}
        />
      </form>
    </div>
  );
};

const TodoTasks = ({}) => {
  return (
    <div>
      <label>Subtask 1<input type="checkbox" /></label>
      <label>Subtask 2<input type="checkbox" /></label>
      <label>Subtask 3<input type="checkbox" /></label>
    </div>
  )
}

const Todo = ({ todo, nowEditing, remove, done, move, edit, dragStart, dragEnd }) => {

  const onEnter = (id, event) => {
    if (event.keyCode === 13) {
      event.target.blur()
      edit(todo.id, event.target.value)
    }
  }

  const onClick = () => {
    // reset editing state
    edit(null, '')
  }

  let todoClasses = classNames(
    'todo',
    {'todo--highlight': todo.id === nowEditing},
    {'todo--complete': todo.complete}
  );

  return (
    <div className={todoClasses} draggable="true" onDragStart={dragStart} onDragEnd={dragEnd} data-id={todo.id}>
      <label id={todo.id}>
        <input type="checkbox" id={todo.id} onClick={() => { done(todo.id); }} defaultChecked={todo.complete} />
      </label>
      <input className="todo__title" type="text" title={todo.id + ' – ' + todo.text} defaultValue={todo.text} onKeyUp={(event) => { onEnter(todo.id, event)} } onClick={() => { onClick()} }/>
      <TodoDueAt todo={todo} />
      <TodoFutureDay todo={todo} />
      <div className="todo__actions">
        <div className="todo__remove" onClick={() => { remove(todo.id); }}>&times;</div>
        <TodoMove todo={todo} move={move} />
      </div>
    </div>
  );
};

const TodoMove = ({ todo, move }) => {
  if (isPast(todo) || isToday(todo)) {
    return (
      <div className="todo__move" onClick={() => { move(todo.id); }}>&#8593;</div>
    )
  } else {
    return null;
  }
}

const TodoDueAt = ({ todo }) => {
  if (todo.dueAt) {
    return (
      <div className="todo__due-at">{Moment(todo.dueAt).format('h:mm A')}</div>
    )
  } else {
    return null;
  }
}

const TodoFutureDay = ({ todo }) => {
  if (isFuture(todo)) {
    return (
      <div className="todo__due-at">{Moment(todo.updatedAt).format('dddd')}</div>
    )
  } else {
    return null;
  }
}

// Basic set of todo filters
// Date
const isFuture = todo => Moment(todo.updatedAt).isAfter(Moment().valueOf(), 'day');
const isToday = todo => Moment(todo.updatedAt).isSame(Moment().valueOf(), 'day');
const isPast = todo => Moment(todo.updatedAt).isBefore(Moment().valueOf(), 'day');

// Status
const isDone = todo => todo.complete;
const isNotDone = todo => !todo.complete;

// Sorting
const sortDesc = (a,b) => b.id - a.id;
const sortAsc = (a,b) =>  a.id - b.id

const TodoListHeader = ({ visible, toggleVisible, title, viewId }) => {
  return (
    <div className={"todo-list-section__header " + (visible ? '' : 'todo-list-section__header--hidden' )} onClick={() => { toggleVisible({viewId}); }}>{title}</div>
  );
};

const TodoListFuture = ({ visible, toggleVisible, todos, nowEditing, add, remove, done, showDone, move, edit }) => {
  let futureDone = todos.filter(isFuture).filter(isDone).sort(sortDesc);
  let futureNotDone = todos.filter(isFuture).filter(isNotDone).sort(sortDesc);
  let futureAllTodos = [];

  if(showDone) {
    futureAllTodos = _.union(futureNotDone, futureDone);
  } else {
    futureAllTodos = futureNotDone;
  }

  if (futureAllTodos.length) {
    if(visible) {
      return (
        <div className="todo-list-section">
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Soon (' + futureAllTodos.length + ')' } viewId={'future'} />
          <CSSTransitionGroup transitionName="todo-" transitionEnterTimeout={250} transitionLeaveTimeout={150}>
            {futureAllTodos.map(todo => (
              <Todo todo={todo} key={todo.id} nowEditing={nowEditing} remove={remove} done={done} move={move} edit={edit} />
            ))}
          </CSSTransitionGroup>
          <TodoForm add={add} />
        </div>
      );
    } else {
      return (
        <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Soon (' + futureAllTodos.length + ')' } viewId={'future'} />
      )
    }
  } else {
    return null;
  }
}

const TodoListToday = ({ visible, toggleVisible, todos, nowEditing, nowDragging, add, remove, done, showDone, move, edit, dragStart, dragEnd, dragOver }) => {
  let todayDone = todos.filter(isToday).filter(isDone);
  let todayNotDone = todos.filter(isToday).filter(isNotDone);
  let todayAllTodos = [];

  if(showDone) {
    todayAllTodos = _.union(todayNotDone, todayDone);
  } else {
    todayAllTodos = todayNotDone;
  }

  let todayTitle = todayNotDone.length ? 'Today (' + todayNotDone.length + ')' : 'Today'

  let todoListClasses = classNames(
    'todos todos--today',
    {'todos--drag-active': nowDragging}
  );

  if (visible) {
    return (
      <div className="todo-list-section">
        <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={todayTitle} viewId={'today'} />
        <CSSTransitionGroup transitionName="todo-" component="div" className={todoListClasses} onDragOver={dragOver} transitionEnterTimeout={250} transitionLeaveTimeout={150}>
          {todayAllTodos.map(todo => (
            <Todo todo={todo} key={todo.id} nowEditing={nowEditing} remove={remove} done={done} move={move} edit={edit} dragStart={dragStart} dragEnd={dragEnd} />
          ))}
        </CSSTransitionGroup>
        <TodoForm add={add} />
      </div>
    )
  } else {
    return (
      <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Today (' + todayNotDone.length + ')' } viewId={'today'} />
    )
  }
}

const TodoListPast = ({ visible, toggleVisible, todos, nowEditing, remove, done, showDone, move, edit }) => {
  let otherNotDone = todos.filter(isPast).filter(isNotDone).sort(sortDesc);

  if (visible) {
    if (otherNotDone.length) {
      return (
        <div className="todo-list-section">
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Backlog'} viewId={'someday'} />
          {otherNotDone.map(todo => (
            <Todo todo={todo} key={todo.id} nowEditing={nowEditing} remove={remove} done={done} move={move} edit={edit} />
          ))}
        </div>
      );
    } else {
      return null;
    }
  } else {
    return (
      <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Backlog'} viewId={'someday'} />
    )
  }
}

const TodoListDones = ({ visible, toggleVisible, todos, nowEditing, remove, done, showDone, move, edit }) => {
  let dones = todos.filter(isPast).filter(isDone).sort(sortDesc);

  if (visible) {
    if (dones.length) {
      return (
        <div className="todo-list-section">
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Dones'} viewId={'dones'} />
          {dones.map(todo => (
            <Todo todo={todo} key={todo.id} nowEditing={nowEditing} remove={remove} done={done} move={move} edit={edit} />
          ))}
        </div>
      );
    } else {
      return null;
    }
  } else {
    return (
      <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Dones'} viewId={'dones'} />
    )
  }
}

// @todo - find a better place for this
let placeholder = document.createElement('div');
placeholder.className = 'todo--placeholder';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showDone: true,
      showDebug: false,
      futureVisible: false,
      todayVisible: true,
      somedayVisible: false,
      donesVisible: false,
      nowEditing: null,
      nowDragging: false
    };
  }

  componentDidMount() {
    this.setState({ data: this.loadState() });
    document.addEventListener("visibilitychange", this.handleTabFocus.bind(this), false);
  }

  handleTabFocus() {
    if (document.visibilityState === 'visible') {
      // When the window is opened or focused, refresh the list
      this.forceUpdate()
    }
  }

  handleAdd(val) {
    let id = this.state.data.length + 1
    let NLDate = chrono.parse(val);
    let updatedAt = Moment({hour: 0}).valueOf();
    let dueAt = null;
    let text = val;

    // If a date string was passed and parsed...
    if (NLDate.length) {
      updatedAt = Moment(NLDate[0].start.date()).isSame(Moment().valueOf(), 'day') ? Moment().valueOf() : Moment(NLDate[0].start.date()).valueOf();
      if (NLDate[0].start.knownValues.hour) {
        dueAt = Moment(NLDate[0].start.date()).valueOf();
      }
      text = text.replace(NLDate[0].text, '').trim();
    }

    const todo = {text: text, complete: false, id: id, createdAt: Moment().valueOf(), updatedAt: updatedAt, dueAt: dueAt, doneAt: null};
    this.state.data.push(todo);
    this.setState({ data: this.state.data });
    this.saveState(this.state.data);
  }

  handleRemove(id) {
    const remainder = this.state.data.filter(todo => {
      if (todo.id !== id) return todo;
    });
    this.setState({ data: remainder });
    this.saveState(remainder);
  }

  handleDone(id) {
    const remainder = this.state.data.filter(todo => {
      if (todo.id === id) {
        todo.complete = !todo.complete;
        todo.doneAt = Moment().valueOf();
        return todo;
      } else {
        return todo
      }
    });
    this.setState({ data: remainder });
    this.saveState(remainder);
  }

  handleMove(id) {
    const remainder = this.state.data.filter(todo => {
      if (todo.id === id) {
        // If todo is from the past (someday), then move it to today
        if (Moment(todo.updatedAt).isBefore(Moment().valueOf(), 'day')) {
          todo.updatedAt = Moment().valueOf()
        } else {
          todo.updatedAt = Moment(todo.updatedAt).add(1, 'd').valueOf()
        }
        return todo;
      }
      if (todo.id !== id) return todo;
    });
    this.setState({ data: remainder });
    this.saveState(remainder);
  }

  handleEdit (id, value) {
    let nowEditingId = null;

    const remainder = this.state.data.filter(todo => {
      // Is this the todo we need to edit?
      if (todo.id === id) {
        // Has todo text changed?
        if (todo.text !== value) {
          todo.text = value;
          nowEditingId = todo.id;
          return todo;
        } else {
          return todo;
          nowEditingId = null;
        }
      } else {
        return todo;
      }
    });
    this.setState({ data: remainder, nowEditing: nowEditingId });
    this.saveState(remainder);
  }

  handleDragStart(e) {
    this.setState({ nowDragging: true });

    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  handleDragEnd(e) {
    this.setState({ nowDragging: false });
    this.dragged.style.display = "flex";
    this.dragged.parentNode.removeChild(placeholder);

    let data = this.state.data;
    let from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);

    let toIndex = data.findIndex(todo => todo.id === to);
    let fromIndex = data.findIndex(todo => todo.id === from);

    data.splice(toIndex, 0, data.splice(fromIndex, 1)[0]);
    this.setState({data: data});
    this.saveState(data);

  }

  handleDragOver(e) {
    e.preventDefault();
    this.dragged.style.display = "none";
    if(e.target.className == "todo--placeholder") return;
    this.over = e.target;

    // Inside the dragOver method
    let relY = e.clientY - this.over.offsetTop;
    let height = this.over.offsetHeight / 2;
    let parent = e.target.parentNode;

    if(relY > height) {
      this.nodePlacement = "after";
      parent.insertBefore(placeholder, e.target.nextElementSibling);
    }
    else if(relY < height) {
      this.nodePlacement = "before"
      parent.insertBefore(placeholder, e.target);
    }
  }

  todoCount() {
    const remainder = this.state.data.filter(todo => {
      if (!todo.complete) return todo;
    });
    return remainder.length;
  }

  toggleShowDone(){
    let showDone = !this.state.showDone;
    this.setState({ showDone: showDone });
  }

  toggleVisible(view) {
    // futureVisible
    // todayVisible
    // somedayVisible
    // donesVisible

    let Visibility = !this.state[view.viewId + 'Visible'];
    this.setState({ [view.viewId + 'Visible']: Visibility});
  }

  saveState(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  loadState() {
    if (localStorage.getItem('todos')){
      return JSON.parse(localStorage.getItem('todos'));
    } else {
      return [{ text: "Share this todo app with friends ;-)", complete: false, id: 1, createdAt: Moment().valueOf(), updatedAt: Moment({hour: 0
      }).valueOf(), dueAt: null, doneAt: null}];
    }
  }

  updateDataStruct() {
    let updatedTodos = _.each(this.state.data, function(todo){
      delete todo.sortId
    });
    this.setState({data: updatedTodos});
    this.saveState(updatedTodos)
  }

  resetData(){
    this.setState({data: []});
    this.saveState([])
  }

  render() {
    return (
      <div className="todos-app">
        <div className="header">
        <Title todoCount={this.todoCount()} />
        <TodoListOptions showDone={this.state.showDone}
                         toggleShowDone={this.toggleShowDone.bind(this)}
                         resetData={this.resetData.bind(this)}
                         updateDataStruct={this.updateDataStruct.bind(this)} />
        <TodoListDebugOptions showDebug={this.state.showDebug}
                              resetData={this.resetData.bind(this)}
                              updateDataStruct={this.updateDataStruct.bind(this)} />
        </div>
        <TodoListFuture
          visible={this.state.futureVisible}
          toggleVisible={this.toggleVisible.bind(this)}
          showDone={this.state.showDone}
          todos={this.state.data}
          nowEditing={this.state.nowEditing}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
          add={this.handleAdd.bind(this)}
        />
        <TodoListToday
          visible={this.state.todayVisible}
          toggleVisible={this.toggleVisible.bind(this)}
          showDone={this.state.showDone}
          todos={this.state.data}
          nowEditing={this.state.nowEditing}
          nowDragging={this.state.nowDragging}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
          add={this.handleAdd.bind(this)}
          dragStart={this.handleDragStart.bind(this)}
          dragEnd={this.handleDragEnd.bind(this)}
          dragOver={this.handleDragOver.bind(this)}
        />
        <TodoListPast
          visible={this.state.somedayVisible}
          toggleVisible={this.toggleVisible.bind(this)}
          showDone={this.state.showDone}
          todos={this.state.data}
          nowEditing={this.state.nowEditing}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
        />
        <TodoListDones
          visible={this.state.donesVisible}
          toggleVisible={this.toggleVisible.bind(this)}
          showDone={this.state.showDone}
          todos={this.state.data}
          nowEditing={this.state.nowEditing}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
        />
      </div>
    );
  }
}

export default TodoApp;
