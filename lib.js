const fs = require('fs');
const { RuntimeArgs, CLValueBuilder, Contracts, DeployUtil, CLPublicKey, CLKey, Keys, CLAccountHash } = require('casper-js-sdk');

// Hex-Key to Byte-Key
function publicKeyBytes(hex_key){
  return CLPublicKey.fromHex(hex_key);
}

// Creates and parses Keys
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

// Instantiates a product contract ("child" contract) object
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

// Instantiates a Supplychain contract ("parent" contract) object
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

module.exports = {SupplychainContract, KeyManager, publicKeyBytes};
