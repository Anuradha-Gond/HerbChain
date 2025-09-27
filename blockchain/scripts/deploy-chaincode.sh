#!/bin/bash

# Deploy HerbChain Smart Contract to Hyperledger Fabric Network

set -e

# Set environment variables
export FABRIC_CFG_PATH=${PWD}/config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="HerbChainOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/herbchain.example.com/peers/peer0.herbchain.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/herbchain.example.com/users/Admin@herbchain.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# Package the chaincode
echo "Packaging chaincode..."
peer lifecycle chaincode package herbchain.tar.gz --path ./chaincode --lang node --label herbchain_1.0

# Install chaincode on peer
echo "Installing chaincode on peer..."
peer lifecycle chaincode install herbchain.tar.gz

# Get package ID
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo "Package ID: $PACKAGE_ID"

# Approve chaincode definition
echo "Approving chaincode definition..."
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.herbchain.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/herbchain.example.com/orderers/orderer.herbchain.example.com/msp/tlscacerts/tlsca.herbchain.example.com-cert.pem --channelID herbchain-channel --name herbchain --version 1.0 --package-id $PACKAGE_ID --sequence 1

# Check commit readiness
echo "Checking commit readiness..."
peer lifecycle chaincode checkcommitreadiness --channelID herbchain-channel --name herbchain --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/herbchain.example.com/orderers/orderer.herbchain.example.com/msp/tlscacerts/tlsca.herbchain.example.com-cert.pem --output json

# Commit chaincode definition
echo "Committing chaincode definition..."
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.herbchain.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/herbchain.example.com/orderers/orderer.herbchain.example.com/msp/tlscacerts/tlsca.herbchain.example.com-cert.pem --channelID herbchain-channel --name herbchain --version 1.0 --sequence 1

# Query committed chaincodes
echo "Querying committed chaincodes..."
peer lifecycle chaincode querycommitted --channelID herbchain-channel --name herbchain --cafile ${PWD}/organizations/ordererOrganizations/herbchain.example.com/orderers/orderer.herbchain.example.com/msp/tlscacerts/tlsca.herbchain.example.com-cert.pem

# Initialize the ledger
echo "Initializing ledger..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.herbchain.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/herbchain.example.com/orderers/orderer.herbchain.example.com/msp/tlscacerts/tlsca.herbchain.example.com-cert.pem -C herbchain-channel -n herbchain --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/herbchain.example.com/peers/peer0.herbchain.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'

echo "Chaincode deployment completed successfully!"
