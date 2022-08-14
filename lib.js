const fs = require('fs');
const { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, DeployUtil, CLPublicKey, CLKey, Keys, CLAccountHash } = require('casper-js-sdk');

function publicKeyBytes(hex_key){
  return CLPublicKey.fromHex(hex_key);
}

class KeyManager{
  constructor (path){
    this.path = path;
  }
  updateKeyPath(path){
    this.path = path;
  }
  newKeys(){
    const k = Keys.Ed25519.new();
    let public_key = k.exportPublicKeyInPem();
    let private_key = k.exportPrivateKeyInPem();
    fs.writeFile(this.path + 'public.pem', public_key, err => {
      if (err) {
        console.error(err);
      }
    });
    fs.writeFile(this.path + 'private.pem', private_key, err => {
      if (err) {
        console.error(err);
      }
    });
  }
  asymmetricKeyPair(){
    return Keys.Ed25519.parseKeyFiles(this.path + 'public.pem', this.path + 'private.pem');
  }
  publicKeyHex(){
    return CLPublicKey.fromEd25519(Keys.Ed25519.parsePublicKeyFile(this.path + 'public.pem')).toHex();
  }
}

class ProductContract{
  constructor(Client, hash){
    this.Client = Client;
    this.hash = hash;
    this.contract = new Contracts.Contract(Client);
    this.contract.setContractHash(hash);
  }
  setClient(Client){
    this.Client = Client;
    this.contract = Contracts.Contract(Client);
  }
  setHash(hash){
    this.hash = hash;
    this.contract.setContractHash(hash);
  }
}

class SupplychainContract{
  constructor(Client, hash){
    this.Client = Client;
    this.hash = hash;
    this.contract = new Contracts.Contract(Client);
    this.contract.setContractHash(hash);
  }
  setClient(Client){
    this.Client = Client;
    this.contract = Contracts.Contract(Client);
  }
  setHash(hash){
    this.hash = hash;
    this.contract.setContractHash(hash);
  }
  newProductContract(hash){
    const product_contract = new Contracts.Contract(this.Client);
    product_contract.setContractHash(hash);
    return product_contract;
  }
  async queryProductHash(id, dict_key)  {
    return await this.contract.queryContractDictionary(
      dict_key,
      id
    ).then(response => {
      return "hash-" + response.data;
    }).catch(error => {
      return error;
    });
  }
  async queryProduct(id, account_hash, dict_key){
    const contract_hash = await this.queryProductHash(id, dict_key);
    const product_contract = this.newProductContract(contract_hash);
    const result = product_contract.queryContractDictionary(
      "owned_tokens", // hardcoded as part of NFT standard.
      account_hash
    ).then(response => {
      let owned = [];
      for (let i = 0; i < response.data.length; i++){
        owned.push(response.data[i].data);
      };
      return owned;
    }).catch(error => {
      const e = "Failed to find base key at path"
      if (error.toString().includes(e.toString())) {
        console.log("Account does not own a " + id);
      }
      else{
        console.log(error.toString());
      }
      return []
    });
    return result;
  }
  async transferProduct(public_key, product_hash, id, dict_key, sender, recipient, keymanager, node_addr, gas){
    const Product = new ProductContract(this.Client, await this.queryProductHash(id, dict_key));
    const args = RuntimeArgs.fromMap({
      // dummy meta as json string: '{\"name\":\"John Doe\",\"token_uri\":\"https://www.barfoo.cong\",\"checksum\":\"940bffb3f2bba35f84313aa26da09ece3ad47045c6a1292c2bbd2df4ab1a55fc\"}'
      'token_hash':CLValueBuilder.string(product_hash),
      'source_key': CLValueBuilder.key(publicKeyBytes(sender)),
      'target_key': CLValueBuilder.key(publicKeyBytes(recipient))
    });
    const req = Product.contract.callEntrypoint("transfer", args,  publicKeyBytes(public_key), "casper-test", gas, [], 10000000);
    const signedDeploy = DeployUtil.signDeploy(req, keymanager.asymmetricKeyPair());
    const result = signedDeploy.send(node_addr).then((res) => {
      return res;
    }).catch((error) => {
      return error;
    });
    return result;
  }
  async mintProduct(public_key, id, dict_key, metadata, keymanager, node_addr, gas){
    const Product = new ProductContract(this.Client, await this.queryProductHash(id, dict_key));
    const args = RuntimeArgs.fromMap({
      'token_meta_data':CLValueBuilder.string(metadata),
      'token_owner': CLValueBuilder.key(publicKeyBytes(public_key))
    });
    const req = Product.contract.callEntrypoint("mint", args, publicKeyBytes(public_key), "casper-test", gas, [], 10000000);
    const signedDeploy = DeployUtil.signDeploy(req, keymanager.asymmetricKeyPair());
    const result = signedDeploy.send(node_addr).then((res) => {
      return res;
    }).catch((error) => {
      return error;
    });
    return result;
  }
}

const node_addr = "http://162.55.245.219:7777/rpc/";
const Client = new CasperClient(node_addr);
const hash = "hash-6e7757c21690a60ac1dd4846a02cf8f4df33e2b933ba68116a9aad9de90ad724";
testContract = new SupplychainContract(Client, hash);
async function test(){
  //console.log(await testContract.queryProductHash("Daytona", "items"));
  //await testContract.queryProduct("Daytona", "bfb5162e42c111b1211e565201777d780c1873f63b767ba73d6bdb398d3a8bb2", "items");
  // Example for querying a Product-row ( Daytona )
  await console.log(await testContract.queryProduct("Daytona", "bfb5162e42c111b1211e565201777d780c1873f63b767ba73d6bdb398d3a8bb2", "items"));
  keymanager = new KeyManager("./");
  //console.log(keymanager.publicKeyHex());
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
  //keymanager.newKeys();
  //await console.log(keymanager.publicKeyHex());
  /*await console.log(await testContract.mintProduct(
    "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1",
    "Daytona",
    "items",
    '{\"name\":\"Daytona Watch 09\",\"token_uri\":\"https://www.daytona.ch\",\"checksum\":\"Null\"}',
    keymanager,
    node_addr,
    "50000000000" // 50 casper
  ));*/
}
test()
