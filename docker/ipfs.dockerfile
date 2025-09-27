# IPFS Node Docker Configuration
FROM ipfs/kubo:latest

# Expose IPFS ports
EXPOSE 4001 5001 8080

# Set up IPFS configuration
RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]' && \
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]' && \
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization"]' && \
    ipfs config --json Addresses.Gateway '"/ip4/0.0.0.0/tcp/8080"' && \
    ipfs config --json Addresses.API '"/ip4/0.0.0.0/tcp/5001"'

# Enable experimental features
RUN ipfs config --json Experimental.FilestoreEnabled true && \
    ipfs config --json Experimental.UrlstoreEnabled true

# Start IPFS daemon
CMD ["daemon", "--migrate=true", "--agent-version-suffix=docker"]
