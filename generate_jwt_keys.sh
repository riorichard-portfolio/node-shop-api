#!/bin/bash

# Create jwt_keys directory if it doesn't exist
mkdir -p jwt_keys

# Generate access token key pair
echo "Generating access token key pair..."
openssl genpkey -algorithm RSA -out jwt_keys/access_token_jwt_private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in jwt_keys/access_token_jwt_private_key.pem -pubout -out jwt_keys/access_token_jwt_public_key.pem

# Generate refresh token key pair  
echo "Generating refresh token key pair..."
openssl genpkey -algorithm RSA -out jwt_keys/refresh_token_jwt_private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in jwt_keys/refresh_token_jwt_private_key.pem -pubout -out jwt_keys/refresh_token_jwt_public_key.pem

# Set permissions (optional, untuk security)
chmod 600 jwt_keys/*_private_key.pem
chmod 644 jwt_keys/*_public_key.pem

echo "✅ Key pairs generated successfully in jwt_keys/ directory:"
echo ""
echo "Access Token Keys:"
echo "  Private: jwt_keys/access_token_jwt_private_key.pem"
echo "  Public:  jwt_keys/access_token_jwt_public_key.pem"
echo ""
echo "Refresh Token Keys:"
echo "  Private: jwt_keys/refresh_token_jwt_private_key.pem"
echo "  Public:  jwt_keys/refresh_token_jwt_public_key.pem"