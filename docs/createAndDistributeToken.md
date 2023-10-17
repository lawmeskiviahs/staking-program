# Create and Distribute Tokens
Unstake tokens from the staking program
## Overview
It includes the following features:
- generates 6 fresh accounts out of which 1 is admin and 5 are users
- create a fresh token
- create associated token accounts for all 6 accounts
- distribute the token among the 6 users
- freeze the mint authority of token so that no new token can be minted

#### To interact with the Initialize function:
1. Change directory to app:
```bash
cd ../app
```
2. run script:
```bash
node createAndDistributeToken.js
```
## Explaination
refer to inline docs for explaination.