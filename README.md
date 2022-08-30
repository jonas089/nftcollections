# Casper Multi Token Standard Library - build upon the CEP-78 Standard

This javascript library allows for easy integration of the CEP78 NFT standard for supplychain projects where a single parent contract tracks multiple collection contracts. \
Comparison CEP78 Token Standard (left side) \
and CEP78 Multi Token Standard (right side) https://www.diffchecker.com/5qOWV3HI. \
The only change that has been made is, \
that on "parent" deployment ( when main.rs call() is executed ) a dictionary named "items" is initialized. \
This dictionary is then used to track "child" contracts, where key:value => contract_name:contract_hash.
In order to retrieve the contract_hash of a collection ( "child" contract ), one can simply query the "parent" \
contract's "items" dict with the collection_name.

**Examples are found in tests.js**

## query
Access: **Public** \
Find the product hash of every product for a given collection ( collection by id ), that is currently owned by an account.
## mint
Access: **Installer** \
Mint a product of a given collection with unique Metadata! The Metadata should be generated automatically by either the Client, as this library takes Metadata as an input and does NOT generate/increment ids.
## transfer
Access: **Owner** \
Transfer a product (by product hash and collection). \
Can only be called by the owner of a product.
### Some "modes" have been hardcoded for simplicity, but they can still be changed according to the CEP78 Standard
https://github.com/casper-ecosystem/cep-78-enhanced-nft/blob/dev/README.md
