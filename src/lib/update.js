function updateData(oldData, newData, exceptionArr, keyIndex) {
  let rowInfo = findMatchingRows(oldData, newData, keyIndex);
  let data = {
    output: [],
    newRows: rowInfo.newRows
  }
  let exceptions = invertExceptions(exceptionArr, newData[0].length);
  let matches = rowInfo.matches;
  for (let i = 0; i < matches.length; i++) {
    let updatedRow = updateRow(oldData[matches[i].a], newData[matches[i].b], exceptions); // some sort of bug here. i'm getting repeated rows 10 times (the length of the row array.)
    data.output.push(updatedRow);
  }
  return data
}

function findMatchingRows(arrA, arrB, keyIndex) {
  let data = {
    matches: [],
    newRows: 0
  }
  let pair = {};
  let newRows = 0;
  let strikes = 0;
  let max = arrA.length;
  for (let bIndex = 0; bIndex < arrB.length; bIndex++) {
    let keyValue = arrB[bIndex][keyIndex];
    for (let aIndex = 0; aIndex < arrA.length; aIndex++) {
      if (arrA[aIndex][keyIndex] === arrB[bIndex][keyIndex]) {
        pair = { b: bIndex, a: aIndex };
        data.matches.push(pair);
      } else {
        strikes++;
      }
      if (strikes === max) {
        data.newRows++;
      }
    }
    strikes = 0;
  }
  return data;
}

function updateRow(oldRow, newRow, exceptions) {
  for (let i = 0; i < oldRow.length; i++) {
    if (oldRow[i] !== newRow[i] && checkExceptions(exceptions, i) !== true) {
      newRow[i] = oldRow[i];
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