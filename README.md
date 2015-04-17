# RestfulNode
This repositary is an effort to create an easy to use production ready framework for node.js using it as a RESTFUL API.

### Technologies:-

1) ExpressJs --- Used to create the scaffold for the Framework. See http://wwww.expressjs.com for full documentation
2) PassportJs --- Used to create the Authentication system. See http://www.passportjs.org for documentation
3) SequilizeJs --- We are using MySQL for the Api db. Squelizejs is a very good ORM written for nodejs with a lot many features. See http://www.docs.sequelizejs.com for more information.

### Authentication:-

We use the passport-localapikey-update module to secure our app via a static apiKey. For more info https://www.npmjs.com/package/passport-localapikey-update
We store our apikey within the app/Config/Config.js

### How to run:-

First you have to install nodejs and npm onto your machine.
The Official Nodejs website https://nodejs.org/ has good tutorial about how to install them.

Then follow the expressjs documentation and install expressjs and the express-generator

Clone the repositary 
```sh
git clone https://github.com/jumacro/RestfulNode YourProjectName
```
Go to your project root. Run the package installer
```sh
npm install
```
Rename go to app.js and set up your project credentials as per your need.

Set up your database as per the schema structure residing on the model folder -> app/Model

Go to Config.js residing at app/Config. Change the credentials to your comfort.

Run the application as:-
```sh
npm start
```
### POSTMAN test

N.B. POSTMAN is a crome extension for Api testing.

On POSTMAN put http://localhost:3000/api/v1.0/ as URL
Choose "GET"
Click on Headers tab, and pass the apikey via the header.
The apikey should match with the apikey you stored in your app/Config/Config.js file.

### Production trick

Install forever.js. Its a easy to way to keep your node app persistant. Follow the bellow blog for more information:-
http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/

Happy Coding :)
