import Web3 from 'web3';
import IPFSClient from 'ipfs-http-client';
import grpc from 'grpc';
import RegistryNetworks from 'singularitynet-platform-contracts/networks/Registry.json';
import RegistryAbi from 'singularitynet-platform-contracts/abi/Registry.json';
import services from './state_service_grpc_pb';
import messages from './state_service_pb';

const networkId = "3";
const providerHost = 'https://ropsten.infura.io';
const httpProvider = new Web3.providers.HttpProvider(providerHost);
const ipfsHost = 'ipfs.singularitynet.io';
const ipfsPort = '80';
const ipfsProtocol = 'http';
const privateKey = process.env.SNET_PRIVATE_KEY;

const web3 = new Web3(httpProvider);
const ipfsClient = IPFSClient({ host: ipfsHost, port: ipfsPort, protocol: ipfsProtocol });

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.defaultAccount = account.address;
const registryContract = web3.eth.Contract(RegistryAbi, RegistryNetworks[networkId].address, { from: web3.eth.defaultAccount });

export const getChannelState = async (orgId, serviceId, channelId) => {
  const orgIdBytes = web3.utils.fromAscii(orgId);
  const serviceIdBytes = web3.utils.fromAscii(serviceId);
  const { metadataURI } = await registryContract.methods.getServiceRegistrationById(orgIdBytes, serviceIdBytes).call();

  const ipfsCID = `${web3.utils.hexToUtf8(metadataURI).substring(7)}`;
  const data = await ipfsClient.cat(ipfsCID);
  const service = JSON.parse(data.toString());
  const serviceEndpoint = service.endpoints[0].endpoint;
  const servicePaymentAddress = service.groups[0].payment_address;
  const paymentChannelStateServiceClient = new services.PaymentChannelStateServiceClient(serviceEndpoint, grpc.credentials.createInsecure());

  const sha3Message = web3.utils.soliditySha3({ t: 'uint256', v: channelId });
  const signature = web3.eth.accounts.sign(sha3Message, process.env.SNET_PRIVATE_KEY);
  const signatureBytes = Buffer.from(signature.signature, 'hex');

  const channelIdBytes = Buffer.alloc(4);
  channelIdBytes.writeUInt32BE(channelId, 0);

  const channelStateRequest = new messages.ChannelStateRequest();
  channelStateRequest.setChannelId(channelIdBytes);
  channelStateRequest.setSignature(signatureBytes);

  return new Promise((resolve, reject) => {
    paymentChannelStateServiceClient.getChannelState(channelStateRequest, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
};

const main = async () => {
  const orgId = 'test-snet';
  const serviceId = 'httpService';
  const channelId = 1770;

  await getChannelState(orgId, serviceId, channelId);
};

main();
