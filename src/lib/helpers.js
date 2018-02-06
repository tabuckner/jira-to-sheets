function colToindex(string) {
  let indeces = [];
  string = string.toUpperCase().replace(/\s/g,'');
  let cols = string.split(',');
  for (col of cols) {
<<<<<<< HEAD
=======
    // console.log(lettersToNumber(col));
>>>>>>> master
    indeces.push(lettersToNumber(col));
  }
  return(indeces);
}

function lettersToNumber(letters){
  return letters.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0) - 1;
}

module.exports = {
  colToindex: colToindex
}