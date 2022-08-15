const {CasperClient, Keys, DeployUtil, CLPublicKey} = require('casper-js-sdk');
const fs = require('fs');
// Check whether a Deploy is pending, was successful, or has failed.

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

async function isDeployed(Client, hash){
  const info = await Client.getDeploy(hash);
  let deploy_status = "";
  try{
    deploy_status = info[1].execution_results[0].result;
  }
  catch(error){
    return "pending";
  }
  if (JSON.stringify(deploy_status).includes("Success")){
    console.log(info[0].hash);
    const as_bytes = info[0].hash;
    //console.log(buf2hex(as_bytes));
    return "success";
  }
  else {
    await console.log("DeployStatusError: ", JSON.stringify(deploy_status));
    return "failed";
  }
}
const getBinary = function(path){
  return new Uint8Array(fs.readFileSync(path, null).buffer);
}

const installWasmFile = async function(
  nodeAddress,
  keys,
  chainName,
  pathToContract,
  runtimeArgs,
  paymentAmount){
  const client = new CasperClient(nodeAddress);
  // Set contract installation deploy (unsigned).
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      CLPublicKey.fromHex(keys.publicKey.toHex()),
      chainName
    ),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      getBinary(pathToContract),
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );
  deploy = client.signDeploy(deploy, keys);
  return await client.putDeploy(deploy);
};

module.exports = {
  isDeployed,
  installWasmFile
}
