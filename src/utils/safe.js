import initSdk from '@gnosis.pm/safe-apps-sdk'

class Safe {

  constructor() {
    this.sdk = initSdk([/.*localhost.*/])
  }

  activate(onUpdate) {
    const onSafeInfo = (info) => {
      this.info = info;
      console.log({info});
      onUpdate({})
    };
    this.sdk.addListeners({ onSafeInfo })
  }

  deactivate() {
    this.sdk.removeListeners()
  }

  sendTransactions(txs) {
    this.sdk.sendTransactions(txs)
  }

  isConnected() {
    return this.info !== undefined
  }

  getSafeInfo() {
    const info = this.info;
    if (info === undefined) throw Error("Not connected to a Safe");
    return info
  }
}

export default Safe;
