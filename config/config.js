module.exports = {
  default: {
    user: '<yourdefaultuser>',
    pass: '<yourdefaultpass>'
  },
  questions: [
    {
      type: 'confirm',
      name: 'initial',
      message: 'Is this your first time using the tool? (Default: False)',
      default: false,
    },
    {
      type: 'input',
      name: 'atlUser',
      message: 'Your Atlassian/Jira username: ',
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'password',
      name: 'atlPassword',
      mask: '*',
      message: 'Your Atlassian/Jira password: ',
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'input',
      name: 'sheetKey',
      message: 'Google Sheets key or URL',
      when: (answers) => {
        return answers.initial === false
      }
    },
  ],
}