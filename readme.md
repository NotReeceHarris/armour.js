# armour.js
> avoid and track the threat actor while protecting your webserver from multiple attack vectors. using behavior ware and data filtering to block malicious content. 

### Installation
This is a [Node.js](https://nodejs.org/) module available through the [npm registry](https://www.npmjs.com/). Before installing, [download and install Node.js](https://nodejs.org/en/download/). Node.js 10.x or higher is required. If this is a brand new project, make sure to create a package.json first with the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file). Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):
```bash
npm i armour.js
```

### Setup
This is a minimal setup using [expressjs](https://expressjs.com/), however any web-server libary that supports [middleware](https://en.wikipedia.org/wiki/Middleware) is compatable. By default security and mocking is enabled, for more information on options check the [wiki](https://github.com/NotReeceHarris/troller.js/wiki).
```js
const troller = require('armour.js');
const express = require('express');
const app = express();

app.use(
    troller(
        {"paths": ['/block']}
    )
);

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.listen(3000)
```
