# A library to query, mint and transfer NFTs on Casper - Built specifically for supplychain projects

This javascript library allows for easy integration of the CEP78 NFT standard for supplychain projects where a single parent contract tracks multiple collection contracts. \
A CEP78 deploy that is suitable for integration could look like this: https://www.diffchecker.com/5qOWV3HI (right side).

# Examples are found in tests.js
## |query|
Access: [PUBLIC]
Find the product hash of every product for a given collection ( collection by id ), that is currently owned by an account.
## |mint|
Access: [MANUFACTURER]
Mint a product of a given collection with unique Metadata! The Metadata should be generated automatically by either the Client, as this library takes Metadata as an input and does NOT generate/increment ids.
## |transfer|
Access: [OWNER]
Transfer a product (by product hash and collection).
Can only be called by the owner of a product.
