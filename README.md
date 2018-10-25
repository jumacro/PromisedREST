# IP Rest

## Overview

This is the REST API for Istanbul Pazarlari - A ecommerce portal.
We have used yarn over npm.
We have used Passport.js for Authentication.


## Getting Started

Clone the repo:
```sh
git clone https://github.com/yolotechnologies/ip-api.git
cd ip-api
```

Install yarn:
```js
npm install -g yarn
```

Install dependencies:
```sh
yarn
```

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=ip-api:* yarn start
```
Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.


Lint:
```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch

# Run lint on any file change and try to fix problems
yarn lint:fix
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

##### Deployment

```sh
# compile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. It has support for multiple transports.  A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file. I just log to the console for simplicity, To do:- Can configure more transports as per requirement.

#### API logging
Logs detailed info about each api request to console during development.


#### Error logging
Logs stacktrace of error to console along with other details. 
