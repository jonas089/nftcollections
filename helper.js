const {CasperClient} = require('casper-js-sdk');
const {isDeployed, installWasmFile} = require('./utils.js');
const {node_addr, hash} = require('./constants.js');
Client = new CasperClient(node_addr);

async function deployState(Client, hash){
  await console.log(await isDeployed(Client, hash));
}

deployState(Client, "ba20428ffe31d3f1fb1a64c37da3bb4925b1be830a8dc98d46f29fd6792a089b");
