const {CasperClient} = require('casper-js-sdk');
const {SupplychainContract, KeyManager} = require('./lib.js');
const {node_addr, hash} = require('./constants.js');
const {isDeployed} = require('./utils.js');

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
async function mint(
  public_key,
  id,
  dict_key,
  metadata,
  keymanager,
  node_addr,
  gas)
  {
  await console.log("Deploy Hash:");
  await console.log(
    await testContract.mintProduct(
      public_key,
      id,
      dict_key,
      metadata,
      keymanager,
      node_addr,
      gas)
  );
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
  await console.log("Deploy Hash:");
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

async function test_utils(){
  // currently this throws an error if the deploy is pending. 
  await console.log(await isDeployed(Client, "ba20428ffe31d3f1fb1a64c37da3bb4925b1be830a8dc98d46f29fd6792a089b"));
}

query(
  "Daytona",
  "bfb5162e42c111b1211e565201777d780c1873f63b767ba73d6bdb398d3a8bb2",
  "items"
);

test_utils();
/*
transfer(
  // public key hex - TBD: use keymanager in the future
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  // product hash
  "aba42bc6b59e68be55f85f656eebba370092370aa87eb3dfeefb0088f0b0d077",
  "Daytona",
  "items",
  // public key hex sender
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  // public key hex recipient
  "01eecc8e4f5b0bd8e7dd37e236ebb49720d77f9d2ed825dcdf6f1b616ffbb5104a",
  // keymanger takes the path of the keys as a constructor argument
  new KeyManager("./"),
  node_addr,
  // gas fee
  "5000000000" // 5 casper
)*/
/*
mint(
  // public key hex
  "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
  "Daytona",
  "items",
  // Note "Daytona Watch 10" - it will make sense to
  // automatically increase the ID when minting, e.g.
  // Daytona Watch 11, ...12, ...13, etc.
  // Changing the ID alone is already enough for
  // the Metadata to be unique and valid.
  '{\"name\":\"Daytona Watch 13\",\"token_uri\":\"https://www.daytona.ch\",\"checksum\":\"Null\"}',
  // keymanger takes the path of the keys as a constructor argument
  new KeyManager('./'),
  node_addr,
  "50000000000" // default mint fee for testing 50 CSPR
)*/
