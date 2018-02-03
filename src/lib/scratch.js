let a = [['a1', 1, 2, 3, 'test', 'my', ''], ['a2', 1, 2, 3, 'test', 'my', ''], ['a3', 1, 2, 3, 'test', 'my', '']];
let b = [['a3', 4, 5, 6, '', '', 'dong'], ['a2', 4, 5, 6, '', '', 'dong'], ['a1', 4, 5, 6, '', '', 'dong'], ['a4', 4, 5, 6, '', '', 'dong']];
let c = [];


function findMatchingRows(arrA, arrB, keyIndex) {
  let matches = [];
  let pair = {};
  let strikes = 0;
  let max = arrA.length;
  for (let bIndex = 0; bIndex < arrB.length; bIndex++) {
    let keyValue = arrB[bIndex][keyIndex];
    for (let aIndex = 0; aIndex < arrA.length; aIndex++) {
      if (arrA[aIndex][keyIndex] === arrB[bIndex][keyIndex]) {
        pair = { b: bIndex, a: aIndex };
        matches.push(pair);
      } else {
        strikes++;
      }
      if (strikes === max) {
        console.log('New Row Found', arrB[bIndex]);
      }
    }
    strikes = 0;
  }
  return matches;
}

function updateRow(oldRow, newRow, exceptions) {
  for (let i = 0; i < oldRow.length; i++) {
    if (oldRow[i] !== newRow[i] && checkExceptions(exceptions, i) !== true) {
      // oldRow[i] = newRow[i];
      newRow[i] = oldRow[i];
    }
  }
  // console.log(oldRow);
  // console.log(newRow);
}

function invertExceptions(exceptions, numColoumns) {
  let trueExceptions = [];
  for (let i = 0; i < numColoumns; i++) { // Define 'dummy' array
    trueExceptions.push(i);
  }
  for (let i = exceptions.length -1; i >= 0; i--) { // Go backwards to avoid losing index context
    trueExceptions.splice(exceptions[i], 1);
  }
  return trueExceptions;
}

function checkExceptions(exceptionArr, testVal) {
  return exceptionArr.some(arrVal => testVal === arrVal);
}

let exceptions = invertExceptions([4,5], 7);

let matches = findMatchingRows(a, b, 0);
console.log(matches);


for (let i = 0; i < matches.length; i++) { // TODO: then append extra data if
  updateRow(a[matches[i].a], b[matches[i].b], exceptions);
}

console.log(b); // This is correct. 
// TODO: Use these formulas to take in the new data; compare to existing and update spreadsheet with diff'd(?) data.