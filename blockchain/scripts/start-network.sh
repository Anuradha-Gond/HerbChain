#!/bin/bash

# Start HerbChain Hyperledger Fabric Network

set -e

echo "Starting HerbChain Blockchain Network..."

# Generate crypto material
echo "Generating crypto material..."
cryptogen generate --config=./crypto-config.yaml

# Generate genesis block
echo "Generating genesis block..."
configtxgen -profile HerbChainOrdererGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block

# Generate channel configuration transaction
echo "Generating channel configuration transaction..."
configtxgen -profile HerbChainChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID herbchain-channel

# Generate anchor peer transactions
echo "Generating anchor peer transactions..."
configtxgen -profile HerbChainChannel -outputAnchorPeersUpdate ./channel-artifacts/HerbChainOrgMSPanchors.tx -channelID herbchain-channel -asOrg HerbChainOrgMSP

# Start the network
echo "Starting Docker containers..."
docker-compose -f docker-compose.yml up -d

# Wait for containers to start
echo "Waiting for containers to start..."
sleep 10

# Create channel
echo "Creating channel..."
export FABRIC_CFG_PATH=${PWD}/config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="HerbChainOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/herbchain.example.com/peers/peer0.herbchain.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/herbchain.example.com/users/Admin@herbchain.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer channel create -o localhost:7050 -c herbchain-channel --ordererTLSHostnameOverride orderer.herbchain.example.com -f ./channel-artifacts/channel.tx --outputBlock ./channel-artifacts/herbchain-channel.block --tls --cafile ${PWD}/organizations/ordererOrganizations/herbchain.example.com/orderers/orderer.herbchain.example.com/msp/tlscacerts/tlsca.herbchain.example.com-cert.pem

# Join channel
echo "Joining channel..."
peer channel join -b ./channel-artifacts/herbchain-channel.block

# Update anchor peers
echo "Updating anchor peers..."
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.herbchain.example.com -c herbchain-channel -f ./channel-artifacts/HerbChainOrgMSPanchors.tx --tls --cafile ${PWD}/organizations/ordererOrganizations/herbchain.example.com/orderers/orderer.herbchain.example.com/msp/tlscacerts/tlsca.herbchain.example.com-cert.pem

echo "HerbChain Blockchain Network started successfully!"
echo "You can now deploy the chaincode using ./deploy-chaincode.sh"
