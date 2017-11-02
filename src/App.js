// Todo
// – drag / drop between sections + date issues
// - Read only - fetch list + items from API
// - Spike redux

import React from 'react';
import './css/app.css';
import './css/todo-icon-font.css';
import List from './containers/list/list.js';
import Nav from './components/nav/nav.js';

// const TodoListDebugOptions = ({showDebug, updateDataStruct, resetData}) => {
//   if (showDebug) {
//     return (
//       <div className="todo-list-options">
//         <button onClick={() => {updateDataStruct()}}>update data struct</button>
//         <button onClick={() => {resetData()}}>reset todo data</button>
//       </div>
//     )
//   } else {
//     return null;
//   }
// }
//
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       showDebug: true
//     };
//   }
//
//   componentDidMount() {
//     this.setHeaders()
//     document.addEventListener("visibilitychange", this.handleTabFocus.bind(this), false);
//   }
//
//   setHeaders() {
//     let userToken = JSON.parse(localStorage.getItem('todo-user')).token
//
//     $.ajaxSetup({
//       beforeSend: function(xhr, settings) {
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.setRequestHeader('Data-Type', 'application/json');
//         xhr.setRequestHeader('Authorization', userToken);
//       }
//     });
//   }
//
//   handleTabFocus() {
//     if (document.visibilityState === 'visible') {
//       // When the window is opened or focused, refresh the list
//       this.forceUpdate()
//     }
//   }
//
//   loadState() {
//     let that = this;
//
//     $.ajax({
//       url: 'http://localhost:3001/v1/lists/9',
//       type: 'GET',
//       success: function(data) {
//         console.log( data.list.items )
//         that.setState({ data: data.list.items});
//       },
//       error: function(xhr, ajaxOptions, thrownError) {
//         console.log(xhr)
//       }
//     });
//
//     // if (localStorage.getItem('todos')){
//     //   return JSON.parse(localStorage.getItem('todos'));
//     // } else {
//     //   return null;
//     // }
//   }
//
//   setWindowTitle() {
//     // let todos = this.state.data.filter(isToday).filter(isNotComplete).length;
//     // document.title = `Todos (${todos})`;
//   }
//
//   resetData(){
//     this.setState({data: []});
//     localStorage.setItem('todos', '');
//   }
//
//   render() {
//     this.setWindowTitle()
//
//     return (
//       <div className="todos-app">
//         <Nav />
//         <TodoListDebugOptions
//           showDebug={this.state.showDebug}
//           resetData={this.resetData.bind(this)}
//          />
//         <List />
//       </div>
//     );
//   }
// }

const App = () => (
  <div className="todos-app">
    <Nav />
    <List />
  </div>
)

export default App;
