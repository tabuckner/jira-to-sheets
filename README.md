# Jira-To-Sheets

_A very simple tool, for a very specific need._

Intended to be installed as a CLI, this tool might help those of us who are interested in automating some of the boring work for preparing regular scrum demos/retrospective meetings. This was originally designed for use by members of my organization. If you don't see my ugly mug on a daily basis, Dan is not crushing it, and you should see [this section](#outside-of-our-organization) below.

For an explanation of the questions you will see in this CLI, please see [this section](#question-overview).

The tool uses Jira's authentication api to store a cookie locally and query your Jira organization for data regarding a given project's current sprint, and upcoming sprint. 

The PlanITPoker report may be copied and pasted direclty into PlanITPoker if this helps you. If you have any feature requests or find any bugs ***PLEASE*** submit an [issue](#bugs-or-feature-requests) so I can work on them for you.

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

### Outside of Our Organization
**When you see this prompt:**
```
? Is Dan Crushing it?
(Default: No) No
```

Simply answer the default no as shown above. This will remove any custom fields from the Jira query and help prevent errors or unwanted data.

**When you see this prompt:**
```
? Jira Project Key (jql) CORE, TBN
```

Simply input the Jira Project Key(s) separated by commas (where applicable) as shown above. 

## Question Overview

### Intial Run
```
? Is this your first time using the tool?
(Default: No) (y/N)
```
If yes, or if recently updated, you will be walked through an authentication process. Must restart tool after completed.

### Organization Hotpath
```
? Is Dan Crushing it?
(Default: No) (y/N)
```
Logic fork to make my buddie's lifes easier. If you dont work with me, answer no.

### Jira Username
```
? Atlassian/Jira username:  
```
Your Jira Username, may be found at:
https://yourdomain.atlassian.net/secure/ViewProfile.jspa

### Jira Password
```
? Atlassian/Jira password:  
```
Your Jira Password, if you dont know it you can probably request it at:
![alt tag](https://media.giphy.com/media/xT0GqlK9efNWRiKhQk/giphy.gif "555 Come-On-Now")

### Action
```
? What opearation are you looking to run?
(Default: Populate Blank Sheet(s)) (Use arrow keys)
❯ Populate Blank Sheet(s)
  Update Existing Sheet(s)
```
Update clears sheet prior to bringing in new data, Populate appends to whatever is existing (best used on a blank sheet).

### Report Type(s)
```
? What reports?
(Default: Both) (Use arrow keys)
  Demo Sheet
  PlanITPoker
❯ Both
```
Demo Sheet example may be found [here](#demo-report)
PlanITPoker example may be found [here](#PlanITPoker)

### Jira Project(s)
```
? Select the Jira Project
  RT
  CORE
  TBN
  CORE & TBN
❯ User Defined
```
First Three options are fast-tracks for my organization, please use User Defined if this doesn't make sense.

### Project Key
```
? Jira Project Key (jql)
```
Enter your Jira Project Key(s) (likely unique to your organization), separated by columns where applicable.

### Demo Sheet Name
```
? Name of Demo Sheet/Tab:
(Default: Sheet1) (Sheet1)
```
Enter the name of the target sheet *Exactly As Shown* in Google Sheets.

### PlanITPoker Target
```
? Name of PlanITPoker Sheet/Tab:
(Default: Sheet2) (Sheet2)
```
Enter the name of the target sheet *Exactly As Shown* in Google Sheets.

### Key Index
```
? Columns letters for Key Index (shared value):
(Default: C) (C)
```
The current column that houses the unique project key on your existing spreadsheet. This is used to link data between old and new data. 

## Exceptions
```
? Columns letters on Demo Sheet excluded from Update separated by columns:
(Default: H, I) (H, I)
```
Column(s) to be excluded from data overwrite and taken as 'more-accurate' on existing sheet. 
**Use Case: **
Q: My organization has assigned a 'Will/Wont Demo' (Column H) column, and an associated 'Who?' Column (Column I) to delegate demos for the end of a sprint. As a user I would like to see this data preserved when udpating my spreadsheet with current Jira data. 
A: Use the default settings above.

### Spreadsheet Target
```
? Google Sheets key or URL: 
```
Enter either the full url or the unique google sheets id key in this field. Url is easier. Copy-Pasta.

## Report Examples

### Demo Report
![alt tag](https://i.imgur.com/CLDkwRE.png "Demo Report")

### PlanITPoker
![alt tag](https://i.imgur.com/1POPcz5.png "PlanITPoker")

## Bugs or Feature Requests

Please submit an Issue via [Github](https://github.com/tabuckner/jira-to-sheets/issues)

## Contributing

Please submit a PR via [Github](https://github.com/tabuckner/jira-to-sheets/pulls)

## Authors

* **Taylor Buckner** - *Initial work* - [tabuckner](https://github.com/tabuckner)

## License

This project is licensed under the MIT License

