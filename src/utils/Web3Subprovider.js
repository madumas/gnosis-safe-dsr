import Web3 from "web3";

class Web3Subprovider extends Web3.providers.HttpProvider {

  constructor(host,safe) {
    super(host);
    this._safe=safe;
  }

  handleRequest(payload,next,end) {
    const self = this;
    // Including the nonce throws an error "couldn't find tx for nonce"
    if (Array.isArray(payload.params)) delete payload.params[0].nonce;
    if(payload.method!=='eth_sendTransaction') {
      self.send(payload, (err, result) => {
        return result ? end(null, result.result) : end(err);
      });
    } else {
      self._safe.sendTransactions(payload.params);
    }
  }

  setEngine = function(engine) {
    const self = this;
    if (self.engine) return;
    self.engine = engine;
    engine.on('block', function(block) {
      self.currentBlock = block;
    });

    engine.on('start', function() {
      self.start();
    });

    engine.on('stop', function() {
      self.stop();
    });
  }


}

export default Web3Subprovider;
