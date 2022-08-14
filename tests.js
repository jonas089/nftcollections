const { CasperClient, RuntimeArgs, CLValueBuilder, Contracts, DeployUtil, CLPublicKey, CLKey, Keys, CLAccountHash } = require('casper-js-sdk');
const {SupplychainContract, KeyManager} = require('./lib.js');
const {node_addr, hash} = require('./constants.js');

// Instance of CasperClient
const Client = new CasperClient(node_addr);
// Instance of the "Parent Contract"
// ( by it's contract hash )
// Note: There is only 1 Parent Contract and X Product Contracts
let testContract = new SupplychainContract(Client, hash);

// Test Function that Queries the accounts balance for a given
// Product-Contract by the name of the Product-Contract
// dict_key is defined when deploying the Parent Contract
// dict_key default is "items"
async function query(name, account, dict_key){
  await console.log(
    await testContract.queryProduct(
    name,
    account,
    dict_key
  ));
}

// Test Function to Mint a Product using Product-Hash.
// Metadata has to be defined and must be unique!
// Metadata should be automatically generated from:
//  a) within the app
//  b) within the contract
// Currently Metadata has to be changed manually.
// Deploying twice the same NFT with the same Metadata
// will fail!
async function mint(){

}

async function transfer(
  public_key,
  product_hash,
  id,
  dict_key,
  sender,
  recipient,
  keymanager,
  node_addr,
  gas)
  {
  await console.log(
    await testContract.transferProduct(
      public_key,
      product_hash,
      id,
      dict_key,
      sender,
      recipient,
      keymanager,
      node_addr,
      gas)
  );
}

query(
  "Daytona",
  "bfb5162e42c111b1211e565201777d780c1873f63b767ba73d6bdb398d3a8bb2",
  "items"
);

transfer(
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  "aba42bc6b59e68be55f85f656eebba370092370aa87eb3dfeefb0088f0b0d077",
  "Daytona",
  "items",
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  "01eecc8e4f5b0bd8e7dd37e236ebb49720d77f9d2ed825dcdf6f1b616ffbb5104a",
  new KeyManager("./"),
  node_addr,
  "5000000000" // 5 casper
)

/* TRANSFER

await console.log(await testContract.transferProduct(
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  "fe7892372177ba66252b7afc681958e64499c1f984cf5a86ca99fe4b84aad8cd",
  "Daytona",
  "items",
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  "01eecc8e4f5b0bd8e7dd37e236ebb49720d77f9d2ed825dcdf6f1b616ffbb5104a",
  keymanager,
  node_addr,
  "1000000000" // 1 casper
))

*/

/* MINT

await console.log(await testContract.mintProduct(
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  "Daytona",
  "items",
  '{\"name\":\"Daytona Watch 09\",\"token_uri\":\"https://www.daytona.ch\",\"checksum\":\"Null\"}',
  keymanager,
  node_addr,
  "50000000000" // 50 casper
));

*/
