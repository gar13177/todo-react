import { todos } from './todos';
import { visibilityFilter } from './visibility';

const element = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO_LIST':
      return {
        ...action.payload,
        maxId: 0,
        todolist: todos(undefined,action),
        isNote: false,
        visibilityFilter: visibilityFilter(undefined, action)
      };
    case 'ADD_NOTE':
      return {
        ...action.payload,
        isNote: true
      };
    default:
      return state;
  }
}

const elements = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO_LIST':
      return [
        ...state,
        element(undefined, action)
      ];

    case 'ADD_NOTE':
      return [
        ...state,
        element(undefined, action)
      ];

    case 'ADD_TODO':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].maxId= ++action.payload.id;
          state[i].todolist= todos(state[i].todolist, action);
        }
      }
      return [...state];
    
    case 'TOGGLE_TODO':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].todolist= todos(state[i].todolist, action);
        }
      }
      return [...state];
    
    case 'REMOVE_TODO':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].todolist= todos(state[i].todolist, action);
        }
      }
      return [...state];

    case 'SET_VISIBILITY_FILTER':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].visibilityFilter= visibilityFilter(undefined, action);
        }
      }

    default:
      return state;
  }
}

export { elements };