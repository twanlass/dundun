import React from 'react';
import Moment from 'moment';
import './App.css';

const Title = ({ todoCount }) => {
  return (
      <div className="title">
        TooDoos ({todoCount})
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
        placeholder="New todo..."
        ref={node => {
          input = node;
        }}
      />
      <br />
    </form>
  );
};

const Todo = ({ todo, remove, done, move }) => {
  return (
    <div className={'todo ' + (todo.complete ? 'todo--complete' : '')}>
      <input
        type="checkbox"
        onClick={() => {
          done(todo.id);
        }}
        defaultChecked={todo.complete}
      />
      <div className="todo__title">{todo.text}</div>
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
const isToday = todo => Moment.utc(todo.updatedAt).isSame(Moment(), 'day');

const isNotToday = todo => !Moment.utc(todo.updatedAt).isSame(Moment(), 'day');

const isDone = todo => todo.complete;

const isNotDone = todo => !todo.complete;

const sortDesc = (a,b) => b.updatedAt - a.updatedAt;

const sortAsc = (a,b) =>  a.updatedAt - b.updatedAt;

const TodoListToday = ({ todos, remove, done, showDone, move }) => {
  let todayTodoNodes = todos.filter(isToday).sort(sortDesc);

  if(!showDone) {
    todayTodoNodes = todayTodoNodes.filter(isNotDone)
  }

  if (todayTodoNodes.length) {
    return (
      <div className="todo-list-section">
        <div className="todo-list-section__header">Today</div>
        {todayTodoNodes.map(todo => (
          <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} />
        ))}
      </div>
    );
  } else {
    return null;
  }
}

const TodoListOther = ({ todos, remove, done, showDone, move }) => {
  let otherTodoNodes = todos.filter(isNotToday).sort(sortDesc);

  if(!showDone) {
    otherTodoNodes = otherTodoNodes.filter(isNotDone)
  }

  if (otherTodoNodes.length) {
    return (
      <div className="todo-list-section">
        <div className="todo-list-section__header">Older</div>
        {otherTodoNodes.map(todo => (
          <Todo todo={todo} key={todo.id} remove={remove} done={done} move={move} />
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
    const todo = {text: val, complete: false, id: performance.now(), createdAt: Moment(), updatedAt: Moment()};
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
        todo.updatedAt = Moment();
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
      return [{ text: "Share this todo app with friends ;-)", complete: false, id: performance.now(), createdAt: Moment(), updatedAt: Moment()}];
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
        />
        <TodoListOther
          showDone={this.state.showDone}
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
        />
      </div>
    );
  }
}

export default TodoApp;
