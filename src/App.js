import React from 'react';
import Moment from 'moment';
import _ from 'lodash';
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
        placeholder="What needs doing?"
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
    if (event.keyCode == 13) {
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
      <div className="todo__remove" onClick={() => { remove(todo.id); }}>&times;</div>
      <TodoMove todo={todo} move={move} />
    </div>
  );
};

const TodoMove = ({ todo, move }) => {
  if (isNotToday(todo)) {
    return (
      <div className="todo__move" onClick={() => { move(todo.id); }}>&#8593;</div>
    )
  } else {
    return null;
  }
}

// Basic set of todo filters
const isToday = todo => Moment(todo.updatedAt).isSame(Moment().valueOf(), 'day');

const isNotToday = todo => !Moment(todo.updatedAt).isSame(Moment().valueOf(), 'day');

const isDone = todo => todo.complete;

const isNotDone = todo => !todo.complete;

const sortDesc = (a,b) => b.updatedAt - a.updatedAt;

const sortAsc = (a,b) =>  a.updatedAt - b.updatedAt;

const TodoListToday = ({ todos, remove, done, showDone, move, edit }) => {
  let todayDone = todos.filter(isToday).filter(isDone).sort(sortDesc);
  let todayNotDone = todos.filter(isToday).filter(isNotDone).sort(sortDesc);
  let todayAllTodos = [];

  if(showDone) {
    todayAllTodos = _.union(todayNotDone, todayDone);
  } else {
    todayAllTodos = todayNotDone;
  }

  if (todayAllTodos.length) {
    return (
      <div className="todo-list-section">
        <div className="todo-list-section__header">Today</div>
        {todayAllTodos.map(todo => (
          <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} edit={edit} />
        ))}
      </div>
    );
  } else {
    return null;
  }
}

const TodoListOther = ({ todos, remove, done, showDone, move, edit }) => {
  let otherDone = todos.filter(isNotToday).filter(isDone).sort(sortDesc);
  let otherNotDone = todos.filter(isNotToday).filter(isNotDone).sort(sortDesc);
  let otherAllTodos = [];

  if(showDone) {
    otherAllTodos = _.union(otherNotDone, otherDone);
  } else {
    otherAllTodos = otherNotDone;
  }

  if (otherAllTodos.length) {
    return (
      <div className="todo-list-section">
        <div className="todo-list-section__header">Older</div>
        {otherAllTodos.map(todo => (
          <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} edit={edit} />
        ))}
      </div>
    );
  } else {
    return null;
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showDone: true
    };
  }

  componentDidMount() {
    this.setState({ data: this.loadState() });
  }

  addTodo(val) {
    const todo = {text: val, complete: false, id: performance.now(), createdAt: Moment().valueOf(), updatedAt: Moment().valueOf()};
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
        todo.updatedAt = Moment().valueOf();
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

  saveState(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  loadState() {
    if (localStorage.getItem('todos')){
      return JSON.parse(localStorage.getItem('todos'));
    } else {
      return [{ text: "Share this todo app with friends ;-)", complete: false, id: performance.now(), createdAt: Moment().valueOf(), updatedAt: Moment().valueOf()}];
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
        <TodoListToday
          showDone={this.state.showDone}
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
        />
        <TodoListOther
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
