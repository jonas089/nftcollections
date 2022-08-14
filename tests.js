const { CasperClient, RuntimeArgs, CLValueBuilder, Contracts, DeployUtil, CLPublicKey, CLKey, Keys, CLAccountHash } = require('casper-js-sdk');
const SupplychainContract = require('./lib.js');
const {node_addr, hash} = require('./constants.js');

// casper client instance
const Client = new CasperClient(node_addr);
// define the parent contract
let testContract = new SupplychainContract(Client, hash);

async function query(name, account, dict_key){
  await console.log(await testContract.queryProduct(
    name,
    account,
    dict_key
  ));
}

async function mint(){

}

async function transfer(){

}

query(
  "Daytona",
  "bfb5162e42c111b1211e565201777d780c1873f63b767ba73d6bdb398d3a8bb2",
  "items"
);
