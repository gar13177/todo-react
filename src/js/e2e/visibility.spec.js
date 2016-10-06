import { visibilityFilter, visibilityFilterElements } from '../reducers/visibility';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

const testSetVisibilityFilter = () => {
  const stateBefore = 'ALL';

  const action = {
    type: 'SET_VISIBILITY_FILTER',
    payload: {
      visibilityFilter: 'HIDE_COMPLETED'
    }
  }

  const stateAfter = 'HIDE_COMPLETED';

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    visibilityFilter(stateBefore, action)
  ).toEqual(stateAfter);
}

const testSetVisibilityFilterGeneral = () => {
  const stateBefore = 'SHOW_ALL_ELEMENTS';

  const action = {
    type: 'SET_VISIBILITY_FILTER_ELEMENTS',
    payload: {
      visibilityFilter: 'HIDE_COMPLETED'
    }
  }

  const stateAfter = 'HIDE_COMPLETED';

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    visibilityFilter(stateBefore, action)
  ).toEqual(stateAfter);
}



testSetVisibilityFilter();
testSetVisibilityFilter();
console.log("All visibility filter tests passed!");

import {} from './elements.spec';

export {}