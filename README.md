# Jira-To-Sheets

_A very simple tool, for a very specific need._

Intended to be installed as a CLI, this tool might help those of us who are interested in automating some of the boring work for preparing regular scrum demos/retrospective meetings.

The tool uses Jira's authentication api to store a cookie locally and query your Jira organization for data regarding a given project's current sprint, and upcoming sprint. 

The data is presented via Google Sheets on two separate tabs. Tab[1] lists information regarding the current sprint, and Tab[2] lists a short breakdown of tickets in the future sprint. This information can be copy-pasta'd directly into PlanITPoker.com to cut down on annoyances. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine as a CLI.
One step configuration and a single End of Sprint `eos` command

### Prerequisites

What things you need to install the software and how to install them

```
node and respective requirements (e.g. xcode, etc)
```

```
Google Account for OAuth process
```

```
Google Sheets spreadsheet.
```

### Installing

As a CLI:

Install globally via NPM

```
<sudo> npm install -g jira-to-sheets
```

## After Installing

You can run the CLI from your terminal...

### To Configure 

Initial run will be used to set up your OAuth credentials for subsequent uses

```
<sudo> eos
```

Answer yes at the first prompt and follow subsequent instructions

```
? Is this your first time using the tool? (Default: False) Y
```

### After Configured

Subsequent executions

```
<sudo> eos
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Taylor Buckner** - *Initial work* - [tabuckner](https://github.com/tabuckner)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

