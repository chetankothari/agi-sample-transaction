// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var state_service_pb = require('./state_service_pb.js');

function serialize_escrow_ChannelStateReply(arg) {
  if (!(arg instanceof state_service_pb.ChannelStateReply)) {
    throw new Error('Expected argument of type escrow.ChannelStateReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_ChannelStateReply(buffer_arg) {
  return state_service_pb.ChannelStateReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_escrow_ChannelStateRequest(arg) {
  if (!(arg instanceof state_service_pb.ChannelStateRequest)) {
    throw new Error('Expected argument of type escrow.ChannelStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_ChannelStateRequest(buffer_arg) {
  return state_service_pb.ChannelStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// PaymentChannelStateService contains methods to get the MultiPartyEscrow
// payment channel state.
// channel_id, channel_nonce, value and amount fields below in fact are
// Solidity uint256 values. Which are big-endian integers padded by zeros, see
// https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#formal-specification-of-the-encoding
var PaymentChannelStateServiceService = exports.PaymentChannelStateServiceService = {
  // GetChannelState method returns a channel state by channel id.
  getChannelState: {
    path: '/escrow.PaymentChannelStateService/GetChannelState',
    requestStream: false,
    responseStream: false,
    requestType: state_service_pb.ChannelStateRequest,
    responseType: state_service_pb.ChannelStateReply,
    requestSerialize: serialize_escrow_ChannelStateRequest,
    requestDeserialize: deserialize_escrow_ChannelStateRequest,
    responseSerialize: serialize_escrow_ChannelStateReply,
    responseDeserialize: deserialize_escrow_ChannelStateReply,
  },
};

exports.PaymentChannelStateServiceClient = grpc.makeGenericClientConstructor(PaymentChannelStateServiceService);
