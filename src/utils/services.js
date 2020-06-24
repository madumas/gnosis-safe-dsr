//import { Safe } from "./safe"
import Maker from '@makerdao/dai'
import {McdPlugin, ETH, BAT, USDC} from '@makerdao/dai-plugin-mcd';
import Web3Subprovider from "./Web3Subprovider"
import rinkebyAddresses from '../contracts/rinkeby';
import goerliAddresses from '../contracts/goerli';
import ropstenAddresses from '../contracts/ropsten';
import Web3 from "web3";

const otherNetworksOverrides = [
  {
    network: 'rinkeby',
    contracts: rinkebyAddresses
  },
  { network: 'goerli', contracts: goerliAddresses },
  { network: 'ropsten', contracts: ropstenAddresses }
].reduce((acc, { network, contracts }) => {
  for (const [contractName, contractAddress] of Object.entries(contracts)) {
    if (!acc[contractName]) acc[contractName] = {};
    acc[contractName][network] = contractAddress;
  }
  return acc;
}, {});

const cdpTypes = [
  { currency: ETH, ilk: 'ETH-A' },
  { currency: BAT, ilk: 'BAT-A' },
  { currency: USDC, ilk: 'USDC-A', decimals: 6 },
];


class SafeBasedServices {
  _safe;
  _web3;
  constructor(safe) {
    this._safe = safe;
  }

  web3() {
    if (!this._web3) {
      this._web3provider=new Web3Subprovider(`https://${this._safe.getSafeInfo().network}.infura.io/v3/8c45ecc4f2e944c7866d974d6dcd52c9`,this._safe);
      this._web3 = new Web3(this._web3provider)
    }
    return this._web3;
  }

  async maker() {
    if(!this._maker) {
      const addressOverrides = ['rinkeby', 'ropsten', 'goerli'].some(
        networkName => networkName === this._safe.getSafeInfo().network
      )
        ? otherNetworksOverrides
        : {};

      const subprovider = this.web3().currentProvider;
      const address = this._safe.getSafeInfo().safeAddress;

      this._maker = await Maker.create('http', {
        url: `https://${this._safe.getSafeInfo().network}.infura.io/v3/8c45ecc4f2e944c7866d974d6dcd52c9`,
        smartContract: {addressOverrides},
        plugins: [
          [maker => {maker.service('accounts', true).addAccountType('GnosisSafe', async () => {
              return {subprovider, address}
            }) }, {}],
          [McdPlugin, {cdpTypes,addressOverrides}]
        ]
      });
      await this._maker.addAccount('gnosis', {type:'GnosisSafe'});
    }
    return this._maker;
  }
}

const buildServices = (safe) => {
  return new SafeBasedServices(safe)
};

export default buildServices
