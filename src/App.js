// @todo notes
// recurring tasks
// task notes, sub-tasks
// sorting / big rocks / grouping of cal items?
// show Dones by date (similar to a logbook)

import React from 'react';
import Moment from 'moment';
import _ from 'lodash';
import chrono from 'chrono-node';
import './App.css';

const Title = ({ todoCount }) => {
  return (
      <div className="title">
        Todos ({todoCount})
      </div>
  );
};

const TodoListOptions = ({showDone, toggleShowDone}) => {
  return (
    <div className="todo-list-options">
      Show Dones? <input type="checkbox" defaultChecked={showDone} onClick={() => {
          toggleShowDone();
        }} />
    </div>
  )
}

const TodoForm = ({ addTodo }) => {
  let input;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTodo(input.value);
        input.value = "";
      }}
    >
      <input
        className="input"
        placeholder="Call tomorrow at 8:30am"
        autoFocus={true}
        ref={node => {
          input = node;
        }}
      />
      <br />
    </form>
  );
};

const Todo = ({ todo, remove, done, move, edit }) => {

  const onEnter = (id, event) => {
    if (event.keyCode === 13) {
      event.target.blur()
      edit(todo.id, event.target.value)
    }
  }

  return (
    <div className={'todo ' + (todo.complete ? 'todo--complete' : '')}>
      <label id={todo.id}>
        <input type="checkbox" id={todo.id} onClick={() => { done(todo.id); }} defaultChecked={todo.complete} />
      </label>
      <input className="todo__title" type="text" title={todo.text} defaultValue={todo.text} onKeyUp={(event) => { onEnter(todo.id, event)} } onChange={(event) => { edit(todo.id, event.target.value) }}/>
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
const sortDesc = (a,b) => b.updatedAt - a.updatedAt;
const sortAsc = (a,b) =>  a.updatedAt - b.updatedAt;

const TodoListHeader = ({ visible, toggleVisible, title, viewId }) => {
  return (
    <div className={"todo-list-section__header " + (visible ? '' : 'todo-list-section__header--hidden' )} onClick={() => { toggleVisible({viewId}); }}>{title}</div>
  );
};

const TodoListFuture = ({ visible, toggleVisible, todos, remove, done, showDone, move, edit }) => {
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
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Upcoming'} viewId={'future'} />
          {futureAllTodos.map(todo => (
            <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} edit={edit} />
          ))}
        </div>
      );
    } else {
      return (
        <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Upcoming'} viewId={'future'} />
      )
    }
  } else {
    return null;
  }
}

const TodoListToday = ({ visible, toggleVisible, todos, remove, done, showDone, move, edit }) => {
  let todayDone = todos.filter(isToday).filter(isDone).sort(sortDesc);
  let todayNotDone = todos.filter(isToday).filter(isNotDone).sort(sortDesc);
  let todayAllTodos = [];

  if(showDone) {
    todayAllTodos = _.union(todayNotDone, todayDone);
  } else {
    todayAllTodos = todayNotDone;
  }

  if (visible) {
    if (todayAllTodos.length) {
      return (
        <div className="todo-list-section">
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Today'} viewId={'today'} />
          {todayAllTodos.map(todo => (
            <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} edit={edit} />
          ))}
        </div>
      );
    } else {
      return null;
    }
  } else {
    return (
      <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Today'} viewId={'today'} />
    )
  }
}

const TodoListPast = ({ visible, toggleVisible, todos, remove, done, showDone, move, edit }) => {
  let otherNotDone = todos.filter(isPast).filter(isNotDone).sort(sortDesc);

  if (visible) {
    if (otherNotDone.length) {
      return (
        <div className="todo-list-section">
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Someday'} viewId={'someday'} />
          {otherNotDone.map(todo => (
            <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} edit={edit} />
          ))}
        </div>
      );
    } else {
      return null;
    }
  } else {
    return (
      <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Someday'} viewId={'someday'} />
    )
  }
}

const TodoListDones = ({ visible, toggleVisible, todos, remove, done, showDone, move, edit }) => {
  let dones = todos.filter(isPast).filter(isDone).sort(sortDesc);

  if (visible) {
    if (dones.length) {
      return (
        <div className="todo-list-section">
          <TodoListHeader visible={visible} toggleVisible={toggleVisible} title={'Dones'} viewId={'dones'} />
          {dones.map(todo => (
            <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} edit={edit} />
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



class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showDone: true,
      futureVisible: false,
      todayVisible: true,
      somedayVisible: false,
      donesVisible: false
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

  addTodo(val) {
    let NLDate = chrono.parse(val);
    let updatedAt = Moment().valueOf();
    let dueAt = null;
    let text = val;

    if (NLDate.length) {
      updatedAt = Moment(NLDate[0].start.date()).isSame(Moment().valueOf(), 'day') ? Moment().valueOf() : Moment(NLDate[0].start.date()).valueOf();
      if (NLDate[0].start.knownValues.hour) {
        dueAt = Moment(NLDate[0].start.date()).valueOf();
      }
      text = text.replace(NLDate[0].text, '');
    }

    const todo = {text: text, complete: false, id: performance.now(), createdAt: Moment().valueOf(), updatedAt: updatedAt, dueAt: dueAt, doneAt: null};
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
      }
      if (todo.id !== id) return todo;
    });
    this.setState({ data: remainder });
    this.saveState(remainder);
  }

  handleMove(id) {
    const remainder = this.state.data.filter(todo => {
      if (todo.id === id) {
        todo.updatedAt = Moment(todo.updatedAt).add(1, 'd').valueOf()
        return todo;
      }
      if (todo.id !== id) return todo;
    });
    this.setState({ data: remainder });
    this.saveState(remainder);
  }

  handleEdit (id, value) {
    const remainder = this.state.data.filter(todo => {
      if (todo.id === id) {
        todo.text = value;
        return todo;
      }
      if (todo.id !== id) return todo;
    });
    this.setState({ data: remainder });
    this.saveState(remainder);
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
      return [{ text: "Share this todo app with friends ;-)", complete: false, id: performance.now(), createdAt: Moment().valueOf(), updatedAt: Moment().valueOf(), doneAt: null}];
    }
  }

  render() {
    return (
      <div className="todos-app">
        <div className="header">
        <Title todoCount={this.todoCount()} />
        <TodoListOptions showDone={this.state.showDone}
                         toggleShowDone={this.toggleShowDone.bind(this)} />
        </div>
        <TodoForm addTodo={this.addTodo.bind(this)} />
        <TodoListFuture
          visible={this.state.futureVisible}
          toggleVisible={this.toggleVisible.bind(this)}
          showDone={this.state.showDone}
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
        />
        <TodoListToday
          visible={this.state.todayVisible}
          toggleVisible={this.toggleVisible.bind(this)}
          showDone={this.state.showDone}
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
        />
        <TodoListPast
          visible={this.state.somedayVisible}
          toggleVisible={this.toggleVisible.bind(this)}
          showDone={this.state.showDone}
          todos={this.state.data}
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
