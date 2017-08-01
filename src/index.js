import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoApp from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<TodoApp />, document.getElementById('root'));
registerServiceWorker();
