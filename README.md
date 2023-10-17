# Solana Staking Program
This repository contains the program login and integrations for a token staking contract for solana.
## Overview
It includes the following features:
- A solana smart contract that implements staking logic for an spl token
- A script that creates some accounts, creates a token and mints it to the accounts
- Scripts to call the various functions in the staking contract.
- Readme for each function in the contract
## Installation of required dependencies
Prerequisites:
- Rust: [Installation Guide](https://www.rust-lang.org/tools/install)(v1.72.1)
- Solana: [Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools)(v1.16.17)
- Anchor: [Installation Guide](https://book.anchor-lang.com/getting_started/installation.html)(v0.29.0)
- Node: [Installation Guide](https://nodejs.org/en/download) (v16)
#### Clone this repo using:
```bash
git clone https://github.com/lawmeskiviahs/staking-program.git
cd staking-program/
``` 
### Install the contract dependencies with npm:
```bash
npm install
```
### Building the contract
```bash
anchor build
```
### Deploy the contract:
```bash
anchor deploy
```
#### To proceed to interacting with the deployed contract find the integration Scripts in:
```bash
cd ./app
```
**Note:-** Find the proper documentation for each function in the docs folder in the root directory.
```bash
cd ./docs
```
#### Correct order of scripts to be called in order to avail the staking functionality:
1. createAndDistributeTokens
2. initialize
3. stake
4. unstake/get_rewards
