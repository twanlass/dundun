// Todo
// - Read only - fetch list + items from API
// - Spike redux

import React from 'react';
import Moment from 'moment';
import chrono from 'chrono-node';
import $ from 'jquery';
import './css/app.css';
import './css/todo-icon-font.css';
import Nav from './components/nav/nav.js';
import ListSection from './components/listSection/listSection.js';
import {isFuture, isToday, isPast, isComplete, isNotComplete} from './helpers.js';

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

// @todo - find a better place for this
let placeholder = document.createElement('div');
placeholder.className = 'todo--placeholder';
placeholder.id = 'todo--placeholder';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showDebug: false,
      nowEditing: null,
      nowDragging: false,
      nowDraggingFrom: null,
      nowDraggingTo: null
    };
  }

  componentDidMount() {
    this.setHeaders()
    let data = this.loadState();

    if (data.length) {
      this.setState({ data: data});
    } else {
      this.handleAdd("Share this todo app with friends ;-)");
    }

    document.addEventListener("visibilitychange", this.handleTabFocus.bind(this), false);
  }

  setHeaders() {
    let userToken = JSON.parse(localStorage.getItem('todo-user')).token

    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        let url = settings.url;
        let external_request = url.indexOf('localhost:3001/v1');

        // If we're making a call to the API
        if (external_request > 1) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Data-Type', 'application/json');
          xhr.setRequestHeader('Authorization', userToken);
        }
      }
    });
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
      completed: false,
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

  handleMove(id, list) {
    // list: future, today, past
    // @todo preserve dueAt time if exists
    let data = this.state.data;
    let todoIndex = data.findIndex(todo => todo.id === id);

    if (list === 'future') {
      data[todoIndex].dueAt = Moment().add(1, 'd').valueOf();
    } else if (list === 'today') {
      data[todoIndex].dueAt = Moment().valueOf();
    } else if (list === 'past') {
      data[todoIndex].dueAt = Moment().subtract(1, 'd').valueOf();
    }

    this.setState({ data: data });
    this.saveState(data);
  }

  onEdit (id) {
    this.setState({ nowEditing: id });
  }

  handleEdit (id, value) {
    let data = this.state.data;
    let todoIndex = data.findIndex(todo => todo.id === id);

    // If the todo text has changed...
    if (data[todoIndex].text !== value) {
      data[todoIndex].text = value;
    }

    this.setState({ data: data, nowEditing: null });
    this.saveState(data);
  }

  handleDragStart(e) {
    this.dragged = e.currentTarget;

    // Get the list we're dragging from based on the currently draged todo
    let data = this.state.data;
    let draggedTodo = data.filter(todo => todo.id === Number(e.currentTarget.dataset.id));
    let nowDraggingFrom = draggedTodo.some(isToday) ? 'today' : 'future';

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
    if (origin !== destination) {
      this.handleMove(from, destination)
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
    if (prevDraggingTo !== nowDraggingTo) {
      this.setState({ nowDraggingTo: nowDraggingTo });
    }

    // If we're dragging over a placeholder, don't update the target yet
    if(e.target.className === "todo--placeholder") return;
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

  saveState(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  loadState() {
    // $.ajax({
    //   url: 'http://localhost:3001/v1/lists',
    //   type: 'GET',
    //   success: function(data) {
    //     console.log(data)
    //   },
    //   error: function(xhr, ajaxOptions, thrownError) {
    //     console.log(xhr)
    //   }
    // });


    if (localStorage.getItem('todos')){
      return JSON.parse(localStorage.getItem('todos'));
    } else {
      return null;
    }
  }

  setWindowTitle() {
    let todos = this.state.data.filter(isToday).filter(isNotComplete).length;
    document.title = `Todos (${todos})`;
  }

  resetData(){
    this.setState({data: []});
    this.saveState([])
  }

  render() {
    this.setWindowTitle()

    return (
      <div className="todos-app">
        <Nav />
        <TodoListDebugOptions
          showDebug={this.state.showDebug}
          resetData={this.resetData.bind(this)}
         />

        <ListSection
          title="today"
          collapsed={false}
          items={this.state.data.filter(isToday)}
          nowEditing={this.state.nowEditing}
          nowDragging={this.state.nowDragging}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
          onEdit={this.onEdit.bind(this)}
          add={this.handleAdd.bind(this)}
          dragStart={this.handleDragStart.bind(this)}
          dragEnd={this.handleDragEnd.bind(this)}
          dragOver={this.handleDragOver.bind(this)}
        />

        <ListSection
          title="Upcoming"
          items={this.state.data.filter(isFuture)}
          nowEditing={this.state.nowEditing}
          nowDragging={this.state.nowDragging}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
          onEdit={this.onEdit.bind(this)}
          add={this.handleAdd.bind(this)}
          dragStart={this.handleDragStart.bind(this)}
          dragEnd={this.handleDragEnd.bind(this)}
          dragOver={this.handleDragOver.bind(this)}
        />

        <ListSection
          title="Anytime"
          items={this.state.data.filter(isPast)}
          nowEditing={this.state.nowEditing}
          nowDragging={this.state.nowDragging}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
          onEdit={this.onEdit.bind(this)}
          add={this.handleAdd.bind(this)}
          dragStart={this.handleDragStart.bind(this)}
          dragEnd={this.handleDragEnd.bind(this)}
          dragOver={this.handleDragOver.bind(this)}
        />

        <ListSection
          title="Done"
          items={this.state.data.filter(isComplete)}
          nowEditing={this.state.nowEditing}
          nowDragging={this.state.nowDragging}
          remove={this.handleRemove.bind(this)}
          done={this.handleDone.bind(this)}
          move={this.handleMove.bind(this)}
          edit={this.handleEdit.bind(this)}
          onEdit={this.onEdit.bind(this)}
          add={this.handleAdd.bind(this)}
          dragStart={this.handleDragStart.bind(this)}
          dragEnd={this.handleDragEnd.bind(this)}
          dragOver={this.handleDragOver.bind(this)}
        />
      </div>
    );
  }
}

export default TodoApp;
