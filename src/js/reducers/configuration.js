
const configurations = (
  state = {
    colors: ["#FFFFFF", "#E57373","#B39DDB","#9FA8DA","#90CAF9","#80CBC4","#A5D6A7","#FFD54F","#FF8A65","#BCAAA4","#90A4AE"],
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