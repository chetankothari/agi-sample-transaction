import Web3 from 'web3';
import AGITokenNetworks from 'singularitynet-token-contracts/networks/SingularityNetToken.json';
import AGITokenAbi from 'singularitynet-token-contracts/abi/SingularityNetToken.json';
import MPENetworks from 'singularitynet-platform-contracts/networks/MultiPartyEscrow.json';
import MPEAbi from 'singularitynet-platform-contracts/abi/MultiPartyEscrow.json';

const providerHost = 'https://kovan.infura.io';
const httpProvider = new Web3.providers.HttpProvider(providerHost);

const web3 = new Web3(httpProvider);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.defaultAccount = account.address;
const agiContract = web3.eth.Contract(AGITokenAbi, AGITokenNetworks["42"].address, { from: web3.eth.defaultAccount });
const mpeContract = web3.eth.Contract(MPEAbi, MPENetworks["42"].address, { from: web3.eth.defaultAccount });

const main = async () => {
  const ethBal = await web3.eth.getBalance(web3.eth.defaultAccount);
  console.log(`Ether Balance: ${ethBal}`);

  const agiBal = await agiContract.methods.balanceOf(web3.eth.defaultAccount).call();
  console.log(`AGI Balance: ${agiBal}`);

  const mpeBal = await mpeContract.methods.balances(web3.eth.defaultAccount).call();
  console.log(`Escrow Balance: ${mpeBal}`);

  const withdrawOperation = mpeContract.methods.withdraw('10');
  const gasPrice = await web3.eth.getGasPrice();
  const gas = await withdrawOperation.estimateGas();

  const receipt = await withdrawOperation.send({ from: web3.eth.defaultAccount, gas, gasPrice })
    .on('transactionHash', (hash) => { console.log(`txnHash -> ${hash}`); })
    .on('receipt', (receipt) => { console.log(`receipt -> ${receipt}`); })
    .on('confirmation', (confNumber, receipt) => { console.log(`confirmation -> ${confNumber}/${receipt}`); });
  console.log(`Withdraw receipt: ${receipt}`);
};

main();
