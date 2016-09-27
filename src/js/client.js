import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';
// import '../styles/index.scss';

import { todos } from './reducers/todos';
import { elements } from './reducers/elements';
import { visibilityFilterElements } from './reducers/visibility';

const { Component } = React;

const todoApp = combineReducers({
  elements,
  visibilityFilterElements
});

const store = createStore(todoApp);

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

const Todo = ({ text, completed, onTodoClicked, onRemoveTodo }) => (
  <div>
    <li
      style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}
      onClick={ onTodoClicked }>
      { text }
    </li>
      <button
          onClick={ onRemoveTodo }
        >Eliminar</button>
  </div>
);

const TodoList = ({ todos, onTodoClicked, onRemoveTodo }) => (
  <ul>
    {
      todos.map(todo => (
        <Todo
          key={ todo.id }
          { ...todo }
          onTodoClicked={ () => onTodoClicked(todo) }
          onRemoveTodo={ () => onRemoveTodo(todo) }
        />
        
      ))
    }
  </ul>
);

const AddTodo = ({ onAddTodo, children }) => {
  let input;

  return (
    <div>
      <input type="text" ref={ node => input = node } />
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
  <div>
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

//let maxId = 0;
const TodosApp = ({ todos, visibilityFilter, maxId, elementId }) => (
  <div>
    <AddTodo
      onAddTodo={
        (text) => {
          store.dispatch({
            type: 'ADD_TODO',
            payload: {
              id: maxId,
              text,
              elementId
            }
          });
        }
      }>Agregar Todo</AddTodo>

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

//-------------------------------------------

const GeneralFooter = ({ currentVisibilityFilter, onFilterClicked }) => (
  <div>
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
  </div>
);

const AddElement = ({ onAddTodoList, onAddNote }) => {
  let input;

  return (
    <div>
      <input type="text" ref={ node => input = node } />
      <button
        onClick={
          () => { 
            onAddNote(input.value);
            input.value = "";
          }
        }
      >Nueva Nota</button>
      <button
        onClick={
          () => { 
            onAddTodoList();
          }
        }
      >Nuevo Todo</button>
    </div>
  );
}


const getVisibleElements = (elements, visibilityFilter) => {
  if(visibilityFilter === 'SHOW_ALL_ELEMENTS'){
    return elements;
  }

  if(visibilityFilter === 'SHOW_NOTES'){
    return elements.filter(t => t.isNote);
  }

  if(visibilityFilter === 'SHOW_TODOS'){
    return elements.filter(t => !t.isNote);
  }
}

const ElementList = ({ elements }) => (
  <ul>
    {
      elements.map(element => (
        <Element
          key={ element.id }
          element={ element }
        />
        
      ))
    }
  </ul>
);

const Element = ({ element }) => {
  switch(element.isNote) {
    case true:
      return {}
    default:
      return (
        <TodosApp
          todos={ element.todolist }
          visibilityFilter={ element.visibilityFilter }
          maxId={ element.maxId }
          elementId={ element.id }
          />
        );
  }
}

let maxIdGeneral = 0;
const ElementsApp = ({ elements, visibilityFilterElements }) => (
  <div>
    <AddElement
      onAddNote={
        (text) => {
          store.dispatch({
            type: 'ADD_NOTE',
            payload: {
              id: maxIdGeneral++,
              text
            }
          });
        }
      }
      onAddTodoList={
        () => {
          store.dispatch({
            type: 'ADD_TODO_LIST',
            payload: {
              id: maxIdGeneral++       
            }
          });
        }
      }
      />
      

      <ElementList
      elements={ getVisibleElements(elements, visibilityFilterElements) }
      />
      <GeneralFooter
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


const render = () => {
  
  ReactDOM.render(
    <ElementsApp
      { ...store.getState() } />,
    document.getElementById('root')
  );
};

render();
store.subscribe(render);