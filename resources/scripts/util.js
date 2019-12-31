const ZomgUtil = (() => {
  function find(array, property, value) {
    for(let i = 0; i< array.length; i++) {
      if(array[i][property] === value) {
        return array[i];
      }
    }
    return;
  }

  return {
    find,
  }

})();