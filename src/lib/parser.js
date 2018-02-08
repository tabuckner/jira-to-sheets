function parseFuture(filepath) {
  let futureData = [];
  const future = filepath;
  const issues = [];
  for (issue of future.issues) {
    let card = '[' + issue.key + ']' + ' - ' + issue.fields.summary;
    issues.push(card);
    let row = [card];
    futureData.push(row);
  }
  return futureData;
}


function parseCurrent(filepath) {
  const current = filepath;
  let data = [];
  let headers = ['Description', 'Type', 'Link', 'Status', 'Developed By', 'Tested By', 'Points', 'Demo', 'By', 'Labels'];
  data.push(headers);

  for (issue of current.issues) {
    let developer, tester, demo = '', by = '', storyPoints;
    issue.fields.customfield_11200 ? developer = issue.fields.customfield_11200.name : developer = '';
    issue.fields.customfield_10900 ? tester = issue.fields.customfield_10900.name : tester = ''; 
    issue.fields.customfield_10005 ? storyPoints = issue.fields.customfield_10005 : storyPoints = '';
    let row = [
      issue.fields.summary, // Description
      issue.fields.issuetype.name, // Type
      issue.key, // Link
      issue.fields.status.name, // Status
      developer,
      tester,
      storyPoints, // Story Points
      demo,
      by,
      issue.fields.labels.join(', '), // Labels
      // issue.fields.assignee.name, // Current assignee
    ];
    data.push(row);
  }
  return data;
}

module.exports = {
  parseFuture: parseFuture,
  parseCurrent: parseCurrent,
}