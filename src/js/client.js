import { createStore, combineReducers, applyMiddleware  } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

import { ActionCreators as UndoActionCreators } from 'redux-undo';
import keydown from 'react-keydown';
//import {Router, browserHistory} from 'react-router';


import v4 from 'uuid-v4';
import '../styles/index.scss';
import { crashReporter, logger } from './middleware/middleware';
import {} from './e2e/todos.spec';
//import routes from './routes';

import { todos } from './reducers/todos';
import { elements } from './reducers/elements';
import { visibilityFilterElements } from './reducers/visibility';
import { configurations } from './reducers/configuration';

const { Component } = React;

const todoApp = combineReducers({
  elements,
  visibilityFilterElements,
  configurations
});

const loadState = () => {
  try{
    let result = JSON.parse(localStorage.getItem('state'));
    return result ? result : undefined;
  }
  catch(err){
    return undefined;
  }
}

const saveState = (state) => {
  try{
    localStorage.setItem('state',JSON.stringify(state));
  }
  catch(err){

  }
}

/* middleware 
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}*/

const store = createStore(todoApp, loadState(), applyMiddleware(logger, crashReporter));

/*
-------------------
-------------------
-------------------
*/



const Header = ({element, onUpdateTitle}) => {
  let input;
  return (
    <div>
      <input
        class="header"
        placeholder='Título'
        defaultValue={ element.title }
        ref={ node => input = node }
        onChange={ () => onUpdateTitle(element.id, input.value) }
      />

    </div>
  );
}


let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <div>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </div>
);

const GeneralFooter = ({ currentVisibilityFilter, onFilterClicked, canUndo, canRedo }) => (
  <div
    class="general-footer"
  >
    Show:
    <FilterLink
      visibilityFilter="SHOW_ALL_ELEMENTS"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>All</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_NOTES"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Notes</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_TODOS"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Todos</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_ARCHIVED"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Archivados</FilterLink>
    <UndoRedo
      canUndo={ canUndo }
      canRedo={ canRedo }
      onUndo={
        () => store.dispatch(UndoActionCreators.undo())
      }
      onRedo={
        () => store.dispatch(UndoActionCreators.redo())
      }
     />
  </div>
);

const AddElement = ({ onAddTodoList, onAddNote }) => {
  let input;

  return (
    <div
      class="add-element"
    >
      <input 
        type="text" 
        placeholder={ 'Nueva Nota' }
        ref={ node => input = node } 
        onKeyDown={
          (event) => {
            if(event.keyCode === 13){
              onAddNote(input.value);
              input.value = "";
            }
          }
        }
      />
      <button
        class="add-element b1"
        onClick={
          () => { 
            onAddNote(input.value);
            input.value = "";
          }
        }
      >Nueva Nota</button>
      <button
        class="add-element b2"
        onClick={
          () => { 
            onAddTodoList();
          }
        }
      >Nuevo Todo</button>
    </div>
  );
}

const getSearchedElements = (elements, configurations) => {
  if ( typeof configurations.search !== "undefined" )
    if ( configurations.search !== "" )
      return elements.filter(
        element => {
          if (typeof element.title !== "undefined")
              if (element.title.toUpperCase().includes(configurations.search))
                return true;
          if (element.isNote){
            if (typeof element.text !== "undefined")
              if (element.text.toUpperCase().includes(configurations.search))
                return true;
          }
          if (!element.isNote){
            let val = false;
            for(var i = 0; i < element.todolist.length; i++) {
              if (element.todolist[i].text.toUpperCase().includes(configurations.search)) {
                  val = true;
              }
            }
            
            return val;
          }
        }
      );
  return elements;
}

const getVisibleElements = (elements, visibilityFilter, configurations) => {
  elements = getSearchedElements(elements, configurations);
  if(visibilityFilter === 'SHOW_ALL_ELEMENTS')
    return elements.filter(t => !t.archived);

  if(visibilityFilter === 'SHOW_NOTES')
    return elements.filter(t => t.isNote).filter(t => !t.archived);
  

  if(visibilityFilter === 'SHOW_TODOS')
    return elements.filter(t => !t.isNote).filter(t => !t.archived);

  
  if(visibilityFilter === 'SHOW_ARCHIVED')
    return elements.filter(t => t.archived);
}

const ElementList = ({ elements, colors }) => (
  <div
    class='column-wrapper'
  >
    {
      elements.map(element => (
        <Element
          key={ element.id }
          element={ element }
          colors={ colors }
        />
        
      ))
    }
  </div>
);

const Element = ({ element, colors}) => {
  let value;
  let button_value;
  if (element.archived)
    button_value = 'Desarchivar';
  else
    button_value = 'Archivar';
  switch(element.isNote) {
    case true:
      value =
        <Note
          note={ element }
          onUpdateNote={
            (elementId, text) => {
              store.dispatch({
                type: 'UPDATE_NOTE',
                payload: {
                  elementId,
                  text
                }
              });
            }
          }
        />
      break;
    default:
      value = <TodosApp
        todos={ element.todolist }
        visibilityFilter={ element.visibilityFilter }
        elementId={ element.id }
        />
      break;
  }
  return (
    <div
      style={{
      background: element.color
      }}
      class="element"
    >
      <Header
        element={ element }
        onUpdateTitle={
          (elementId, text) => {
            store.dispatch({
              type: 'UPDATE_TITLE',
              payload: {
                elementId,
                text
              }
            });
          }
        } 
      />
      { value }
      <button
        class="archivar"
        onClick={ 
          () => {
            store.dispatch({
              type: 'TOGGLE_ARCHIVE',
              payload: {
                elementId: element.id
              }
            });
          } 
        }
      >{ button_value }</button>
      <div
        class="colors"
      >
        {colors.map(color => (
          <button
            class="color"
            key={ colors.indexOf(color) }
            style={{ background: color }}
            onClick={
              () => {
                store.dispatch({
                  type: 'CHANGE_COLOR',
                  payload: {
                    elementId: element.id,
                    color
                  }
                })
              }
            }
            ></button>
          ))
        }
      </div>
    </div>
  );
}

const Note = ({ note, onUpdateNote }) => {
  let input;
  return (
    <input
      class="note"
      defaultValue={ note.text }
      ref={ node => input = node }
      onChange={ () => onUpdateNote(note.id, input.value) }
    />
  );
}

const SearchElement = ({onSearchElement, configurations}) => {
  let input;
  return (
    <div
      class="search-bar"
    >
      <input
        placeholder={ 'Búsqueda' }
        defaultValue= { configurations.search }
        ref={ node => input = node }
        onChange={ () => onSearchElement(input.value) }
        onKeyDown={
          (event) => {
            if(event.keyCode === 27){
              input.value = "";
              onSearchElement(input.value);
            }
          }
        } 
      />
      <button
        onClick={
          () => { 
            input.value = "";
            onSearchElement(input.value);
          }
        }
      >&times;</button>
    </div>

  );

}



const ElementsApp = ({ elements, visibilityFilterElements, configurations }) => {
  
  return(
  <div>
    <SearchElement
      configurations={ configurations }
      onSearchElement={
        (text) => {
          store.dispatch({
            type: 'SEARCH_ELEMENT',
            payload: {
              text
            }
          })
        }
      }
    />
    <div
      class="container"
    >
      <AddElement
        onAddNote={
          (text) => {
            store.dispatch({
              type: 'ADD_NOTE',
              payload: {
                id: v4(),
                text,
                color: configurations.colors[0]
              }
            });
          }
        }
        onAddTodoList={
          () => {
            store.dispatch({
              type: 'ADD_TODO_LIST',
              payload: {
                id: v4(),
                color: configurations.colors[0]       
              }
            });
          }
        }
        />
        

        <ElementList
        elements={ getVisibleElements(elements.present, visibilityFilterElements, configurations) }
        colors={ configurations.colors }
        />
      </div>
      <GeneralFooter
      canUndo={ elements.past.length > 0 }
      canRedo={ elements.future.length > 0 }
      currentVisibilityFilter={ visibilityFilterElements }
      onFilterClicked={
        (filter) => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER_ELEMENTS',
            payload: { visibilityFilter: filter }
          });
        }
      } />


  </div>
  );
}

const FilterLink = ({ visibilityFilter, currentVisibilityFilter, onFilterClicked, children }) => {

  if(visibilityFilter === currentVisibilityFilter){
    return <strong>{ children }</strong>;
  }

  return <a
    href="#"
    onClick={
      (e) => {
        e.preventDefault();
        onFilterClicked(visibilityFilter);
      }
    }>
    { children }</a>
}


const getVisibleTodos = (todos, visibilityFilter) => {
  if(visibilityFilter === 'SHOW_ALL'){
    return todos;
  }

  if(visibilityFilter === 'SHOW_COMPLETED'){
    return todos.filter(t => t.completed);
  }

  if(visibilityFilter === 'SHOW_ACTIVE'){
    return todos.filter(t => !t.completed);
  }
}

const Todo = ({ todo, onTodoClicked, onRemoveTodo, onUpdateTodo}) => {
  let input;
  return (
    <div
      class="todo"
    >
      <input
        type='checkbox'
        defaultChecked={ todo.completed }
        onClick={ onTodoClicked }
      />
      <input
        type="text"
        style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
        }}
        defaultValue={ todo.text }
        ref={ node => input = node }
        onChange={ () => onUpdateTodo(todo, input.value) }
      />
      
      <button
          onClick={ onRemoveTodo }
      >&times;</button>
    </div>
  );
}

const TodoList = ({ todos, onTodoClicked, onRemoveTodo, onUpdateTodo }) => (
  <div>
    {
      todos.map(todo => {
        return(
        <Todo
          key={ todo.id }
          todo={ todo }
          onTodoClicked={ () => onTodoClicked(todo) }
          onRemoveTodo={ () => onRemoveTodo(todo) }
          onUpdateTodo={ onUpdateTodo }
        />
        );
        
    })
    }
  </div>
);

const AddTodo = ({ onAddTodo, children }) => {
  let input;

  return (
    <div
      class="add-todo"
    >
      <input 
        type="text" 
        ref={ node => input = node } 
        placeholder="Nuevo Todo"
        onKeyDown={
          (event) => {
            if(event.keyCode === 13){
              onAddTodo(input.value);
              input.value = "";
            }
          }
        } 
      />
      <button
        onClick={
          () => { 
            onAddTodo(input.value);
            input.value = "";
          }
        }
      >{ children }</button>
    </div>
  );
}

const Footer = ({ currentVisibilityFilter, onFilterClicked }) => (
  <div
    class="footer"
  >
    Show:
    <FilterLink
      visibilityFilter="SHOW_ALL"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>All</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_COMPLETED"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Completed</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_ACTIVE"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Active</FilterLink>
  </div>
);

const TodosApp = ({ todos, visibilityFilter, elementId }) => (
  <div>
    <AddTodo
      class="element"
      onAddTodo={
        (text) => {
          store.dispatch({
            type: 'ADD_TODO',
            payload: {
              id: v4(),
              text,
              elementId
            }
          });
        }
      }>+</AddTodo>

    <TodoList
      todos={ getVisibleTodos(todos, visibilityFilter) }
      onTodoClicked={
        (todo) => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            payload: {
              id: todo.id,
              elementId
            }
          });
        }
      }
      onRemoveTodo={
        (todo) => {
          store.dispatch({
            type: 'REMOVE_TODO',
            payload: {
              id: todo.id,
              elementId
            }
          });
        }
      }
      onUpdateTodo={
        (todo, text) => {
          store.dispatch({
            type: 'UPDATE_TODO',
            payload: {
              id: todo.id,
              elementId,
              text
            }
          })
        }
      }
       />
  
    <Footer
      currentVisibilityFilter={ visibilityFilter }
      onFilterClicked={
        (filter) => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            payload: { 
              visibilityFilter: filter, 
              elementId }
          });
        }
      } />
      
  </div>
);

/*
-----------------
-----------------
-----------------
*/

//Listen for CTRL+Z
function KeyPress(e) {
  const evtobj = window.event ? event : e
  if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
    store.dispatch(UndoActionCreators.undo())
  }

  if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
    store.dispatch(UndoActionCreators.redo())
  }
}
//bind the listener
window.onkeydown = KeyPress;



const render = () => {
  ReactDOM.render(
     <ElementsApp
      { ...store.getState() } />,
    document.getElementById('root')
  );
};


render();
store.subscribe(render);
store.subscribe( () => {
  saveState(store.getState());
});