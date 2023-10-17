# Stake
Stake tokens into the staking program
## Overview
It includes the following features:
- it creates a `stake_info_pda` to stores the staking account information
- it transfers an `amount` of tokens to the escrow wallet (stakes tokens)
- stores information of the staking in the `stake_info_pda`
#### To interact with the Initialize function:
1. Change directory to app:
```bash
cd ../app
```
2. run script:
```bash
node stake.js
```
## Explaination

The `#[derive(Accounts)]` macro is used to define the account constraints for an Anchor program instruction. The `Stake` struct defines the account constraints for the `stake` instruction.

The `Stake` struct has the following fields:

- `user`: The account of the user who is staking. This account must be a signer.
- `state`: The account that stores the state of the program.
- `staking_info_account`: The account that stores the staking information for the - `user`. This account is initialized by the stake instruction if it does not already exist.
- `staking_token`: The account of the SPL token that is being staked.
- `from_token_account`: The account of the SPL token account that the user is staking from. This account must be owned by the user and must contain the SPL token that is being staked.
- `escrow_wallet`: The account of the SPL token account that holds the staked tokens.
- `token_program`: The account of the Solana Token program.
- `system_program`: The account of the Solana System program.

The `#[account(mut)]` macros on the `user`, `state`, `staking_info_account`, `from_token_account`, and `escrow_wallet` fields indicate that those accounts must be mutable. This is because the stake instruction will modify those accounts.

The `#[account(seeds=[b"ludon"], bump)]` macro on the `state` field indicates that the `state` account must have the seeds `[b"ludon"]` and the bump value that is specified in the instruction.

The `#[account(init_if_needed, payer = user, space = 8 + UserInfo::LEN, seeds=[b"pudon"], bump)]` macro on the `staking_info_account` field indicates that the `staking_info_account` will be initialized by the `stake` instruction if it does not already exist. The `payer` argument specifies that the `user` account will pay for the creation of the `staking_info_account` account. The `space` argument specifies the size of the `staking_info_account` account. The `seeds` argument specifies the seeds that will be used to generate the address of the `staking_info_account` account. The `bump` argument is a unique value that is generated when the account is created. It is used to ensure that the account address is unique.

The `#[account(mut, constraint=from_token_account.owner == user.key(), constraint=from_token_account.mint == staking_token.key())]` macro on the `from_token_account` field indicates that the `from_token_account` must be owned by the `user` and must contain the SPL token that is being staked.

The `#[account(mut, seeds = [b"hudon"], bump)]` macro on the `escrow_wallet` field indicates that the `escrow_wallet` must be mutable and must have the seeds `[b"hudon"]` and the `bump` value that is specified in the instruction.

The `#[program()]` macros on the `token_program` and `system_program` fields indicate that those accounts must be programs.