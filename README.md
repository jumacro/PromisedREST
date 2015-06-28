# Fondoo-Node-Api
This is a RESTFUL API created with Nodejs using the Express Framework, Mongoose ORM to handle the MongoDb database and PassportJs to handle the Authentication system.

## Pre-Requisites:-

1) ExpressJs --- Used to create the scaffold for the Framework. See http://wwww.expressjs.com for full documentation

2) PassportJs --- Used to create the Authentication system. See http://www.passportjs.org for documentation

3) Mongoose ORM --- We are using MongoDb for the Api db. Mongoose is a very good ORM written for nodejs with a lot many features. See http://www.mongoosejs.com/docs/guide.html for more information.

### Nodejs

First you have to install nodejs and npm onto your machine.
The Official Nodejs website https://nodejs.org/ has good tutorial about how to install them.
Check out:- https://nodejs.org/download/

### Expressjs

Then follow the expressjs documentation and install expressjs and the express-generator. Please use the -g command to install them globally. 
Like this :--
```sh
npm install express -g
```
And
```sh
npm install express-generator -g
```

### MongoDB

To install MongoDb please follow the below URL:-
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

### Authentication:-

We use the passport-localapikey-update module to secure our app via a static apiKey. For more info https://www.npmjs.com/package/passport-localapikey-update
We store our apikey within the app/Config/Config.js


## Installation and Run


1) Clone the repositary 
```sh
git clone https://github.com/jamesdevries/Fondoo-Node-API.git
```

2) Go to your project root. Run the package installer
```sh
npm install
```
3) Go to Fondoo-Node-API >> app >> Config and open the Config.js file. Change the credentials as per your requirement.

4) Run the application as:-
```sh
npm start
```
Browse your api as http://localhost:3000/api/v1.0 you will see a welcome message

## Use the API

Please follow the Fondoo-Node-API >> app >> router.js you will understand the end-points.

*** The apikey should always be passed as a header for all request to be Authorized. 
Field name: apikey
Value: The string you stored in your Config.js as "apiKey"

1) POST users
http://localhost:3000/api/v1.0/users

Use the POSTMAN Google Chrome App with Normal tab and x-www-form-urlencoded method to submit the form. Pass the header as mentioned above.

2) GET users
http://localhost:3000/api/v1.0/users

Use the POSTMAN Google Chrome App with Normal tab, pass the header as mentioned above, you will get to see the results.

=====