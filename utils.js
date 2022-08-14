const {CasperClient} = require('casper-js-sdk');

// Check whether a Deploy is pending, was successful, or has failed.
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
    return "success";
  }
  else {
    await console.log("DeployStatusError: ", JSON.stringify(deploy_status));
    return "failed";
  }
}

module.exports = {
  isDeployed
}
