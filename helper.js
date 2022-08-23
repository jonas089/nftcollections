const {CasperClient, RuntimeArgs, Contracts, DeployUtil} = require('casper-js-sdk');
const {isDeployed, installParentWasm, queryContractByHash} = require('./utils.js');
const {node_addr, hash} = require('./constants.js');
const {KeyManager, publicKeyBytes} = require('./lib.js');
Client = new CasperClient(node_addr);

async function deployState(Client, hash){
  await console.log(await isDeployed(Client, hash));
}
// [test]
async function Deploy(path, fee){
    const keymanager = new KeyManager("./");
    const keypair = keymanager.asymmetricKeyPair();
    const args = RuntimeArgs.fromMap({
    });
    await console.log(await installParentWasm(
      node_addr,
      keypair,
      "casper-test",
      path,
      args,
      fee // installation fee
    )
  );
}

async function runner(Client, hash){
  // [print result of deployment]
  fee = "100000000000";
  path = "./contract.wasm";
  await Deploy(path, fee);

  // [print status of deploy]
  //await deployState(Client, hash);
}
hash = '' // deploy hash
runner(Client, hash);
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//[test]

/*async function callDummy(Client){
  const client = Client;
  const keymanager = new KeyManager("./");
  const args = RuntimeArgs.fromMap({
  });
  let contract = new Contracts.Contract(Client);
  contract.setContractHash("hash-c909ecd9ef444f3124fbd3161f623c9442126adbde416c31a61637a5432abd16");
  const publickey = "017910998638dd5580e33b513286e2860b085c422987b83dc0d6b27ad04e0701c1";
  console.log(contract);
  const req = contract.callEntrypoint(
    "balanceOf",
    args,
    publicKeyBytes(publickey),
    "casper-test",
    "1000000000",
    [

    ],
    10000000
);
const signedDeploy = DeployUtil.signDeploy(req, keymanager.asymmetricKeyPair());
const result = signedDeploy.send(node_addr).then((res) => {
    return res;
  }).catch((error) => {
    return error;
  });
  return result;
}*/


//dummyDeploy();
//deployState(Client, "0b14731454f8f4934dcef73f932b314ac7884439c739ebbf0ce44dcb62c14d8d");
//queryDeployHash();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
