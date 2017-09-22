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
import Autolinker from 'autolinker'
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

  let linkedTitle = Autolinker.link( todo.text, {truncate: { length: 15, location: 'smart' }} );

  let todoClasses = classNames(
    'todo',
    {'todo--highlight': todo.id === nowEditing},
    {'todo--event': todo.isEvent},
    {'todo--completed': todo.completed}
  );

  // <input className="todo__title" type="text" title={todo.id + ' – ' + todo.text} defaultValue={todo.text} onKeyUp={(event) => { onEnter(todo.id, event)} } onClick={() => { onClick()} }/>

  return (
    <div className={todoClasses} draggable="true" onDragStart={dragStart} onDragEnd={dragEnd} data-id={todo.id}>
      <label id={todo.id}>
        <input type="checkbox" id={todo.id} onClick={() => { done(todo.id); }} defaultChecked={todo.completed} />
      </label>
      <div className="todo__title" title={todo.text} dangerouslySetInnerHTML={{ __html: linkedTitle }}></div>
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
  if (todo.isEvent) {
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
      <div className="todo__due-at">{Moment(todo.dueAt).format('dddd')}</div>
    )
  } else {
    return null;
  }
}

// Basic set of todo filters
// Date
const isFuture = todo => Moment(todo.dueAt).isAfter(Moment().valueOf(), 'day');
const isToday = todo => Moment(todo.dueAt).isSame(Moment().valueOf(), 'day');
const isPast = todo => Moment(todo.dueAt).isBefore(Moment().valueOf(), 'day');

// Status
const isDone = todo => todo.completed;
const isNotDone = todo => !todo.completed;

// Sorting
const sortDesc = (a,b) => b.id - a.id;
const sortAsc = (a,b) =>  a.id - b.id

const TodoListHeader = ({ visible, toggleVisible, title, viewId }) => {
  return (
    <div className={"todo-list-section__header " + (visible ? '' : 'todo-list-section__header--hidden' )} onClick={() => { toggleVisible({viewId}); }}>{title}</div>
  );
};

const TodoListFuture = ({ visible, toggleVisible, todos, nowEditing, nowDragging, add, remove, done, showDone, move, edit, dragStart, dragEnd, dragOver }) => {
  let futureDone = todos.filter(isFuture).filter(isDone);
  let futureNotDone = todos.filter(isFuture).filter(isNotDone);
  let futureAllTodos = [];

  if(showDone) {
    futureAllTodos = _.union(futureNotDone, futureDone);
  } else {
    futureAllTodos = futureNotDone;
  }

  let futureTitle = futureNotDone.length ? 'Soon (' + futureNotDone.length + ')' : 'Soon'

  let todoListClasses = classNames(
    'todos todos--future',
    {'todos--drag-active': nowDragging}
  );

  if (visible) {
    return (
      <div className="todo-list-section">
        <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={futureTitle} viewId={'future'} />
        <CSSTransitionGroup transitionName="todo-" component="div" className={todoListClasses} data-id="future" onDragOver={dragOver} transitionEnterTimeout={250} transitionLeaveTimeout={150}>
          {futureAllTodos.map(todo => (
            <Todo todo={todo} key={todo.id} nowEditing={nowEditing} remove={remove} done={done} move={move} edit={edit} dragStart={dragStart} dragEnd={dragEnd} />
          ))}
        </CSSTransitionGroup>
        <TodoForm add={add} />
      </div>
    )
  } else {
    return (
        <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={futureTitle} viewId={'future'} />
    )
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
        <CSSTransitionGroup transitionName="todo-" component="div" className={todoListClasses} data-id="today" onDragOver={dragOver} transitionEnterTimeout={250} transitionLeaveTimeout={150}>
          {todayAllTodos.map(todo => (
            <Todo todo={todo} key={todo.id} nowEditing={nowEditing} remove={remove} done={done} move={move} edit={edit} dragStart={dragStart} dragEnd={dragEnd} />
          ))}
        </CSSTransitionGroup>
        <TodoForm add={add} />
      </div>
    )
  } else {
    return (
      <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={todayTitle} viewId={'today'} />
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
  let dones = todos.filter(isDone);

  if (visible) {
    if (dones.length) {
      return (
        <div className="todo-list-section">
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Dones (' + dones.length + ')' } viewId={'dones'} />
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
      <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Dones (' + dones.length + ')' } viewId={'dones'} />
    )
  }
}

// @todo - find a better place for this
let placeholder = document.createElement('div');
placeholder.className = 'todo--placeholder';
placeholder.id = 'todo--placeholder';

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
      nowDragging: false,
      nowDraggingFrom: null,
      nowDraggingTo: null
    };
  }

  componentDidMount() {
    let data = this.loadState();

    if (data.length) {
      this.setState({ data: data});
    } else {
      this.handleAdd("Share this todo app with friends ;-)");
    }

    document.addEventListener("visibilitychange", this.handleTabFocus.bind(this), false);
  }

  handleTabFocus() {
    if (document.visibilityState === 'visible') {
      // When the window is opened or focused, refresh the list
      this.forceUpdate()
    }
  }

  handleAdd(val) {
    let text = val;
    let id = (new Date()).getTime();
    let NLDate = chrono.parse(val);
    let dueAt = null;
    let isEvent = null;

    // If a date string was passed and parsed...
    if (NLDate.length) {
      // Set due date to date passed
      dueAt = Moment(NLDate[0].start.date()).valueOf();

      // Remove any date lanuage from todo title, like tomorrow, Friday, etc
      text = text.replace(NLDate[0].text, '').trim();

      // If an exact hour / minute was passed, this todo is an event (meeting, call, dinner, etc)...
      if (NLDate[0].start.knownValues.hour || NLDate[0].start.knownValues.minute) {
        isEvent = true;
      }
    } else {
      // No due date passed – use creation time as default due date
      dueAt = Moment().valueOf();
    }

    const todo = {
      text: text,
      complete: false,
      id: id,
      createdAt: Moment().valueOf(),
      dueAt: dueAt,
      completedAt: null,
      isEvent: isEvent
    };

    this.state.data.push(todo);
    this.setState({ data: this.state.data, nowEditing: null });
    this.saveState(this.state.data);
  }

  handleRemove(id) {
    let todos = this.state.data;
    let todo = todos.findIndex(todo => todo.id === id);

    todos.splice(todo, 1);

    this.setState({ data: todos });
    this.saveState(todos);
  }

  handleDone(id) {
    const remainder = this.state.data.filter(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        todo.completedAt = Moment().valueOf();
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
        if (Moment(todo.dueAt).isBefore(Moment().valueOf(), 'day')) {
          todo.dueAt = Moment().valueOf()
        } else {
          todo.dueAt = Moment(todo.dueAt).add(1, 'd').valueOf()
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
    this.dragged = e.currentTarget;

    // Get the list we're dragging from based on the currently draged todo
    let data = this.state.data;
    let draggedTodo = data.filter(todo => todo.id == e.currentTarget.dataset.id);
    let nowDraggingFrom = draggedTodo.some(isToday) ? 'today' : ' future';

    this.setState({ nowDragging: true, nowDraggingFrom: nowDraggingFrom });

    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  handleDragEnd(e) {
    this.setState({ nowDragging: false });
    this.dragged.style.display = "flex";

    // Remove temp placeholder element
    document.getElementById('todo--placeholder').outerHTML='';

    let data = this.state.data;
    let from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);

    let toIndex = data.findIndex(todo => todo.id === to);
    let fromIndex = data.findIndex(todo => todo.id === from);

    // Return the todo being dragged and the todo it's dropped on
    let origin = this.state.nowDraggingFrom;
    let destination = this.state.nowDraggingTo;

    // If we're dragging from the today list to the future list, 'move' the todo as well
    if (origin != destination) {
      this.handleMove(from)
    }

    data.splice(toIndex, 0, data.splice(fromIndex, 1)[0]);
    this.setState({data: data});
    this.saveState(data);
  }

  handleDragOver(e) {
    let nowDraggingTo = null;
    let prevDraggingTo = this.state.nowDraggingTo;

    e.preventDefault();
    this.dragged.style.display = "none";

    // Which list is the currently dragged item over?
    if (e.target.classList.contains('todos')) {
      nowDraggingTo = e.target.getAttribute('data-id')
    } else {
      nowDraggingTo = e.target.parentElement.getAttribute('data-id')
    }

    // Prevent state update (and render) if we're still dragging around in the same list...
    if (prevDraggingTo != nowDraggingTo) {
      this.setState({ nowDraggingTo: nowDraggingTo });
    }

    // If we're dragging over a placeholder, don't update the target yet
    if(e.target.className == "todo--placeholder") return;
    this.over = e.target;

    // Check if we're dropping beyond the start or end of the list
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
      if (!todo.completed) return todo;
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

    let visibility = !this.state[view.viewId + 'Visible'];
    this.setState({ [view.viewId + 'Visible']: visibility});
  }

  saveState(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  loadState() {
    if (localStorage.getItem('todos')){
      return JSON.parse(localStorage.getItem('todos'));
    } else {
      null;
    }
  }

  updateDataStruct() {
    let that = this;
    let updatedTodos = _.each(this.state.data, function(todo){
      todo.id = (new Date()).getTime();

      if(todo.dueAt) {
        todo.isEvent = true;
      }

      todo.dueAt = todo.updatedAt;
      delete todo.updatedAt;

      todo.completed = todo.complete;
      delete todo.complete;

      that.sleep(10);
    });
    this.setState({data: updatedTodos});
    this.saveState(updatedTodos)
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
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
