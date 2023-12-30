# Getting Started with The Games Library backend

## Installing NodeJS

NodeJS is a Javascript runtime that allows you to run Javascript applications outside the browser. The back-end applications for which we will create a front-end during the lessons will run on NodeJS.

### Install NodeJS on Windows

To install NodeJS on Windows, follow the next steps:

-   Download the latest **nvm-setup.exe** from <https://github.com/coreybutler/nvm-windows/releases>
-   Install NVM
-   Open a Windows Powershell **as administrator**
-   Install the latest NodeJS version by executing:

```
$ nvm install latest
```

-   Now use the ls (list) commando to list the installed NodeJS versions:

```
$ nvm ls
$     18.9.0
    * 16.13.2 (Currently using 64-bit executable)
```

**Note:** the above output can be different on your machine!

-   Make sure to use the latest one that is listed (also if there is only one entry) by executing

```
$ nvm use 18.9.0
```

**Note:** replace 18.9.0 in the example above by the most recent version that is listed on your machine.

### Install NodeJS on MacOS

Installation instructions for MacOS below are based upon <https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac#mac>

- download the MacOS installer on <https://nodejs.org/en/download>
- run installer
- verify installation: open a terminal window and type 
```
node -v
```
- update your NPM version by typing this command in the terminal:
```
sudo npm install npm --global
```
- check you npm version: 
```
npm -v
```

## Install dependencies

First, we need to install some to install some necessary dependencies. We'll do this using Node Package Manager (npm), which comes bundled with NodeJS. In a Powershell or terminal, execute (on Mac you need to sudo these commands):

```
$ npm i -g nodemon
$ npm i -g ts-node
```

## Starting the back-end

Run the following commands in a terminal (starting from the project folder where package.json is located) to install all required node packages and get the server up and running:

```
$ npm install

$ npm start
```

This will start the back-end application on localhost.

You can access the API documentation and test it via Swagger running on http://localhost:3000/.
