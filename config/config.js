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
      message: 'Is this your first time using the tool? \n(Default: No)',
      default: false,
    },
    {
      type: 'list',
      name: 'operation',
      message: 'What opearation are you looking to run? \n(Default: Populate Blank Sheet(s))',
      choices: ['Populate Blank Sheet(s)', 'Update Existing Sheet(s)'],
      default: 'Populate Blank Sheets(s)',
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'list',
      name: 'reportType',
      message: 'What reports? \n(Default: Both)',
      choices: ['Demo Sheet', 'PlanITPoker', 'Both'],
      default: 'Both',
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'list',
      name: 'project',
      message: 'Select the Jira Project',
      default: 'Retail',
      choices: ['RT', 'CORE', 'TBN', 'CORE & TBN', 'User Defined'],
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
      message: 'Does your spreadsheet use default sheet names? \n(\'Sheet1\' And/Or \'Sheet2\')',
      default: true,
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'input',
      name: 'sheet1',
      message: 'Enter the name of Sheet/Tab Demo Sheet:',
      default: null,
      when: (answers) => {
        return answers.tabConfirmation === false && (answers.reportType === 'Both' || answers.reportType === 'Demo Sheet')
      }
    },
    {
      type: 'input',
      name: 'sheet2',
      message: 'Enter the name of PlanITPoker Sheet/Tab:',
      default: null,
      when: (answers) => {
        return answers.tabConfirmation === false && (answers.reportType === 'Both' || answers.reportType === 'PlanITPoker')
      }
    },
  ],
}