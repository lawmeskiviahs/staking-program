# Get Rewards
Transfer staking rewards from escrow account to self
## Overview
It includes the following features:
- checks if the staking has expired or not
- calculate rewards for any leftower staked tokens
- send the staked amount along with the rewards back to the user's account
- close the staking_info_account

#### To interact with the Initialize function:
1. Change directory to app:
```bash
cd ../app
```
2. run script:
```bash
node get_rewards.js
```
## Explaination

The `#[derive(Accounts)]` macro is used to define the account constraints for an Anchor program instruction. The `GetRewards` struct defines the account constraints for the `get_rewards` instruction.

The `GetRewards` struct has the following fields:

- `user`: The account of the user who is claiming rewards. This account must be a signer.
- `state`: The account that stores the state of the program.
- `staking_token`: The account of the SPL token that is being staked.
- `staking_info_account`: The account that stores the staking information for the user.
- `escrow_wallet`: The account of the SPL token account that holds the staked tokens.
- `to_token_account`: The account of the SPL token account that the user wants to - `claim` rewards to. This account must be owned by the user and must have the same SPL token as the staking_token account.
- `token_program`: The account of the Solana Token program.
- `system_program`: The account of the Solana System program.
The `#[account(mut)]` macros on the `user`, `state`, `staking_info_account`, `escrow_wallet`, and `to_token_account` fields indicate that those accounts must be mutable. This is because the `get_rewards` instruction will modify those accounts.

The `#[account(seeds = [b"ludon"], bump = state_bump)]` macro on the state field indicates that the `state` account must have the seeds `[b"ludon"]` and the `state_bump` value.

The `#[account(mut, seeds=[b"pudon"], bump = staker_bump)]` macro on the `staking_info_account` field indicates that the `staking_info_account` must be owned by the `user` and must have the seeds `[b"pudon"]` and the staker_bump value.

The `#[account(mut, seeds = [b"hudon"], bump)]` macro on the `escrow_wallet` field indicates that the `escrow_wallet` must be mutable and must have the seeds `[b"hudon"]` and the bump value.

The `#[account(mut, constraint=to_token_account.owner == user.key(), constraint=to_token_account.mint == staking_token.key())]` macro on the `to_token_account` field indicates that the `to_token_account` must be owned by the `user` and must have the same SPL token as the `staking_token` account.

The `#[program()]` macros on the `token_program` and `system_program` fields indicate that those accounts must be programs.