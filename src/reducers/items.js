import { ADD_TODO, EDIT_TODO, MOVE_TODO, REMOVE_TODO, TOGGLE_TODO } from '../actionTypes/actionTypes.js';

export const items = (state = initialItems, action) => {
  console.log(action)
  switch (action.type) {
    case ADD_TODO:
      return [
              ...state,
              {
                id: action.id,
                title: action.title,
                completed: false,
                completed_at: null,
                due_at: action.due_at,
                is_event: action.is_event
              }
            ]

    case EDIT_TODO:
      return state.map(item => {
        if (item.id !== action.id) {
          return item;
        }

        return {
          ...item,
          title: action.title
        };
      })

    case MOVE_TODO:
      let newState = state.slice(0);
      return move(newState, action.from, action.to);

    case REMOVE_TODO:
      let index = state.findIndex(item => item.id === action.id);
      return state
        .slice(0, index)
        .concat(state.slice(index + 1))

    case TOGGLE_TODO:
      return state.map(item => {
        if (item.id !== action.id) {
          return item;
        }

        return {
          ...item,
          completed: !item.completed,
          completed_at: (item.completed) ? item.completed_at : action.completed_at
        };
      })
    default:
      return state
  }
}

const initialItems = [
  {
    title: 'first todo',
    completed: false,
    id: 1
  }
]


function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
   return arr;
}
