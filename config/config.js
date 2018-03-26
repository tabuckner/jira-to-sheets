module.exports = {
  default: {
    user: '<yourdefaultuser>', // TODO: Test if we can remove this garbage.
    pass: '<yourdefaultpass>' // TODO: Test if we can remove this garbage.
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
      type: 'confirm',
      name: 'isTalEmployee',
      message: 'Is Dan Crushing it? \n(Default: No)',
      default: false,
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'confirm',
      name: 'storeLocal',
      message: 'Would you like to store your Google OAuth token Locally?\nNOTE: This can present security risks. \n(Default: No)',
      default: false,
      when: (answers) => {
        return answers.initial === true
      }
    },
    {
      type: 'confirm',
      name: 'storeAtlLocal',
      message: 'Would you like to store your Atlassian credentials Locally?\nNOTE: This can present security risks. \n(Default: No)',
      default: false,
      when: (answers) => {
        return answers.initial === true
      }
    },
    {
      type: 'input',
      name: 'atlUser',
      message: 'Atlassian/Jira username:\n(Leave Blank if Saved)',
      when: (answers) => {
        return answers.initial === false || answers.storeAtlLocal === true
      }
    },
    {
      type: 'password',
      name: 'atlPassword',
      mask: '*',
      message: 'Atlassian/Jira password:\n(Leave Blank if Saved)',
      when: (answers) => {
        return answers.initial === false || answers.storeAtlLocal === true
      }
    },
    {
      type: 'list',
      name: 'reportType',
      message: 'What reports? \n(Default: Both)',
      choices: ['Demo Sheet', 'PlanITPoker', 'Both'],
      default: 'Demo Sheet',
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'list',
      name: 'operation',
      message: 'What opearation are you looking to run? \n(Default: Populate Blank Sheet(s))',
      choices: ['Populate Blank Sheet(s)', 'Update Existing Sheet(s)'],
      default: 'Populate Blank Sheets(s)',
      when: (answers) => {
        return answers.initial === false && answers.reportType !== 'PlanITPoker'
      }
    },
    {
      type: 'list',
      name: 'project',
      message: 'Select the Jira Project',
      default: 'User Defined',
      choices: ['RT', 'CORE', 'TBN', 'CORE & TBN', 'User Defined'],
      when: (answers) => {
        return answers.initial === false
      }
    },
    {
      type: 'input',
      name: 'userProject',
      message: 'Jira Project Key (jql)',
      default: null,
      when: (answers) => {
        return answers.project === 'User Defined'
      }
    },
    {
      type: 'input',
      name: 'keyIndex',
      message: 'Columns letters for Key Index (shared value): \n(Default: C)',
      default: 'C',
      when: (answers) => {
        return answers.initial === false && answers.operation === 'Update Existing Sheet(s)' &&
          (answers.reportType === 'Demo Sheet' || answers.reportType === 'Both')
      }
    },
    {
      type: 'input',
      name: 'exceptions',
      message: 'Columns letters on Demo Sheet excluded from Update separated by columns: \n(Default: H, I)',
      default: 'H, I',
      when: (answers) => {
        return answers.initial === false && answers.operation === 'Update Existing Sheet(s)' &&
          (answers.reportType === 'Demo Sheet' || answers.reportType === 'Both')
      }
    },
    {
      type: 'input',
      name: 'sheet1',
      message: 'Name of Demo Sheet/Tab: \n(Default: Sheet1)',
      default: 'Sheet1',
      when: (answers) => {
        return answers.reportType === 'Both' || answers.reportType === 'Demo Sheet'
      }
    },
    {
      type: 'input',
      name: 'sheet2',
      message: 'Name of PlanITPoker Sheet/Tab: \n(Default: Sheet2)',
      default: 'Sheet2',
      when: (answers) => {
        return answers.reportType === 'Both' || answers.reportType === 'PlanITPoker'
      }
    },
    {
      type: 'input',
      name: 'sheetKey',
      message: 'Google Sheets key or URL:',
      when: (answers) => {
        return answers.initial === false
      }
    },
  ],
}