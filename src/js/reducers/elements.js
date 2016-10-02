import { todos } from './todos';
import { visibilityFilter } from './visibility';

const element = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO_LIST':
      return {
        ...action.payload,
        todolist: todos(undefined,action),
        isNote: false,
        visibilityFilter: visibilityFilter(undefined, action),
        create_date: new Date().toLocaleString(),
        archived: false
      };
    case 'ADD_NOTE':
      return {
        ...action.payload,
        isNote: true,
        create_date: new Date().toLocaleString(),
        archived: false
      };
      
    default:
      return state;
  }
}

const elements = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO_LIST':
      return [
        element(undefined, action),
        ...state      
      ];

    case 'ADD_NOTE':
      if ( action.payload.text !== "" ){
        return [
          element(undefined, action),
          ...state     
        ];
      }
      return state;

    case 'ADD_TODO':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].todolist= todos(state[i].todolist, action);
          state[i].update_date = new Date().toLocaleString();
        }
      }
      return [...state];
    
    case 'TOGGLE_TODO':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].todolist= todos(state[i].todolist, action);
          state[i].update_date = new Date().toLocaleString();
        }
      }
      return [...state];

    case 'UPDATE_TITLE':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].title= action.payload.text;
          state[i].update_date = new Date().toLocaleString();
        }
      }
      return [...state];

    case 'UPDATE_TODO':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].todolist= todos(state[i].todolist, action);
          state[i].update_date = new Date().toLocaleString();
        }
      }
      return [...state];
    case 'CHANGE_COLOR':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].color = action.payload.color
        }
      }
      return [...state];
    case 'UPDATE_NOTE':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].text = action.payload.text;
          state[i].update_date = new Date().toLocaleString();
        }
      }
      return [...state];
    case 'ARCHIVE_ELEMENT':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].archived= true
        }
      }
      return [...state];
    
    case 'REMOVE_TODO':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].todolist= todos(state[i].todolist, action);
          state[i].update_date = new Date().toLocaleString();
        }
      }
      return [...state];

    case 'SET_VISIBILITY_FILTER':
      for(var i=0; i < state.length; i++){
        if (state[i].id === action.payload.elementId){
          state[i].visibilityFilter= visibilityFilter(undefined, action);
        }
      }
      return [...state];
    default:
      return state;
  }
}

export { elements };