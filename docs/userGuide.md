# User Guide
### Step 1: Create accounts and token:
In the root/apps run the createTokenAndDistribute script using the following command:
```bash
node createTokenAndDistribute.js
```
### Step 2: Copy account info:
- From the logs printed after running the createTokenAndDistribute script copy the secretKeys for all accounts indivisually and paste it in the apps/keypairs.js file in their designated places.
- Copy the mint key from the logs and paste it in the: `initialize.js`, `stake.js`, `unstake.js` and `getRewards.js` files.
### Step 3: Airdrop SOL to the 5 user accounts for gas
- From the logs printed copy the pubkeys of the accounts one by one and airdrop 1 SOL into them.
### Step 4: Build and Deploy the smart contract
- Build the contract using the following command in the root directory of the repository:
```bash
anchor build
```
- Deploy the contract using the following command in the root directory of the repository:
```bash
anchor deploy
```
- After deploying the contract for the first time, copy the `program_id` that was output after the deployment, paste it into the `declare_id!()` macro inside the `lib.rs` file.
- Deploy the contract again.
- Copy the `program_id` from the logs and paste it in the: `initialize.js`, `stake.js`, `unstake.js` and `getRewards.js` files.
### Step 5: Call the initialize function
- Make any necessary changes to the variables if needed.
- With root/app as the working directory run the initialize script using the following command:
```bash
node initialize.js
```
### Step 6: Call the stake function
- Wait until the stake starts.
- With root/app as the working directory run the initialize script using the following command:
```bash
node stake.js
```
### Step 7: Call the unstake function
- Wait until the bonding period passes.
- With root/app as the working directory run the initialize script using the following command:
```bash
node unstake.js
```
### Step 8: Call the get_rewards function
- Wait until the staking period expires.
- With root/app as the working directory run the initialize script using the following command:
```bash
node getRewards.js
```

# Note: Please set the seed phrases properly and update them at the necessary places accordingly. For testing purpose random seed phrases have been passed.