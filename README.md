# PromisedREST 
This is a sample RESTFUL API build on ES6 and Promise approach.

## Getting Started

Clone the repo:
```sh
git clone https://github.com/jumacro/PromisedREST.git
cd PromisedREST
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
DEBUG=easyappchat-server:* yarn start
```
Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.


Lint:
```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. 

## Error Logging

@Todo --- Need a better error log with a pin point status message
@Todo --- Need to render to more better json in-out structure as mentioned in [jsonapi.org](http://jsonapi.org/)