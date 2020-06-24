
# Dai Savings Rates App for Gnosis Safe

Demonstration of the integration of Dai.js inside a Gnosis Safe App

## How to use
- `yarn install`
- Modify this file safe-apps/node_modules/react-scripts/config/webpackDevServer.config.js by adding these lines:
   ```
  headers: {
      "Access-Control-Allow-Origin": "\*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  },
  ```
- `yarn start`
-  Start Gnosis Safe from https://rinkeby.gnosis-safe.io/
- In Apps tab, select Manage Apps, and add the URL of your app (likely http://localhost:3000)


## Issues
Gas limit estimation often fails with metamask. If a transaction fails, resubmit with a higher gas limit. In the future, Gnosis Safe SDK will allow the app to set its own gas limit: https://github.com/gnosis/safe-apps-sdk/issues/21
  



