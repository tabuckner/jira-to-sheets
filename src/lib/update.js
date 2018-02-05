function updateData(oldData, newData, exceptionArr, keyIndex) {
  let output = [];
  let exceptions = invertExceptions(exceptionArr, newData[0].length);
  let matches = findMatchingRows(oldData, newData, keyIndex);
  for (let i = 0; i < matches.length; i++) {
    let updatedRow = updateRow(oldData[matches[i].a], newData[matches[i].b], exceptions); // some sort of bug here. i'm getting repeated rows 10 times (the length of the row array.)
    output.push(updatedRow);
  }
  console.log(output);
  return newData
}

function findMatchingRows(arrA, arrB, keyIndex) {
  let matches = [];
  let pair = {};
  let newRows = 0;
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
        newRows++;
      }
    }
    strikes = 0;
  }
  console.log(newRows, 'New Rows Found');
  return matches;
}

function updateRow(oldRow, newRow, exceptions) {
  for (let i = 0; i < oldRow.length; i++) {
    if (oldRow[i] !== newRow[i] && checkExceptions(exceptions, i) !== true) {
      newRow[i] = oldRow[i];
      // console.log(newRow[i], 'is now', oldRow[i]);
      // console.log(newRow);
    }
  }
  return newRow;
}

function invertExceptions(exceptions, numColoumns) {
  let trueExceptions = [];
  for (let i = 0; i < numColoumns; i++) { // Define 'dummy' array
    trueExceptions.push(i);
  }
  for (let i = exceptions.length - 1; i >= 0; i--) { // Go backwards to avoid losing index context
    trueExceptions.splice(exceptions[i], 1);
  }
  return trueExceptions;
}

function checkExceptions(exceptionArr, testVal) {
  return exceptionArr.some(arrVal => testVal === arrVal);
}

module.exports = {
  updateData: updateData
}