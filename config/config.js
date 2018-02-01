module.exports = {
  default: {
    user: '<yourdefaultuser>',
    pass: '<yourdefaultpass>'
  },
  project: null,
  questions: [
    {
      type: 'confirm',
      name: 'initial',
      message: 'Is this your first time using the tool? (Default: False)',
      default: false,
    },
    {
      type: 'list',
      name: 'project',
      message: 'Select the Jira Project',
      default: 'Retail',
      choices: ['RT', 'CORE', 'TBN', 'User Defined'],
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'input',
      name: 'userProject',
      message: 'Input Jira Project Key',
      default: null,
      when: (answers) => {
        return answers.project === 'User Defined'
      }
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
    {
      type: 'confirm',
      name: 'tabConfirmation',
      message: 'Would you like to use the default sheet names? (\'Sheet1\', \'Sheet2\')',
      default: true,
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'input',
      name: 'sheet1',
      message: 'Enter the name of Sheet/Tab 1:',
      default: null,
      when: (answers) => {
        return answers.tabConfirmation === false
      }
    },
    {
      type: 'input',
      name: 'sheet2',
      message: 'Enter the name of Sheet/Tab :',
      default: null,
      when: (answers) => {
        return answers.tabConfirmation === false
      }
    },
  ],
}