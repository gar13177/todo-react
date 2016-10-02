
const configurations = (
  state = {
    colors: ["#FFFFFF", "#90A4AE","#E91E63","#9C27B0","#673AB7","#F44336","#3F51B5","#2196F3"],
    search: ""}, action) => {
  switch (action.type){
    case 'SEARCH_ELEMENT':
      state.search = action.payload.text.toUpperCase();
      return state;
    default:
      return state;
    
  }
}

export { configurations };