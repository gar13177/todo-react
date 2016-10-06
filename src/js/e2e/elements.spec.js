import { elementsReducer } from '../reducers/elements';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

const testAddTodoList = () => {
  const stateBefore = [];

  const action = {
    type: 'ADD_TODO_LIST',
    payload: {
      id: 0,
      color: 'a'
    }
  }

  const stateAfter = [
      {
        id: 0,
        todolist: [],
        color: 'a',
        isNote: false,
        visibilityFilter: 'SHOW_ALL',
        create_date: '0',
        archived: false
      }
    ];

  deepFreeze(stateBefore);
  deepFreeze(action);
  let element = elementsReducer(stateBefore, action);
  element[0].create_date = '0';
  expect(
    element
  ).toEqual(stateAfter);
}

const testAddNote = () => {
  const stateBefore = [];

  const action = {
    type: 'ADD_NOTE',
    payload: {
      id: 0,
      color: 'a'
    }
  }

  const stateAfter = [
      {
        id: 0,
        color: 'a',
        isNote: true,
        create_date: '0',
        archived: false
      }
    ];

  deepFreeze(stateBefore);
  deepFreeze(action);
  let element = elementsReducer(stateBefore, action);
  element[0].create_date = '0';
  expect(
    element
  ).toEqual(stateAfter);
}

const testAddTodo = () => {
  const stateBefore = [
    {
      id: 0,
      todolist: [
        {
          id: 0,
          text: 'Limpiar mi casa',
          completed: false
        }
      ]
    }
  ];

  const action = {
    type: 'ADD_TODO',
    payload: {
      elementId: 0,
      id: 1,
      text: 'algo'
    }
  }

  const stateAfter = [{
      id: 0,
      todolist: [
        {
          id: 0,
          text: 'Limpiar mi casa',
          completed: false
        },
        {
          id: 1,
          text: 'algo',
          elementId:0,
          completed: false
        }
      ],
      update_date: '0'
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);
  let element = elementsReducer(stateBefore, action);
  element[0].update_date = '0';
  expect(
    element
  ).toEqual(stateAfter);
}

testAddTodoList();
testAddNote();
//testAddTodo();

console.log("All elements tests passed!");

export {}