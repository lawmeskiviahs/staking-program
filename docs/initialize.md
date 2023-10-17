# Initialize
Initialise the accounts for the purpose of our staking program
## Overview
It includes the following features:
- it creates a state account PDA to store the staking information
- it creates a token escrow PDA to hold the staked tokens as well as the reward tokens
- stores the staking information provided by the admin into the state account
- transfer an amount of tokens to the escrow account for distributing rewards later
#### To interact with the Initialize function:
1. Change directory to app:
```bash
cd ../app
```
2. run script:
```bash
node initialise.js
```

## Explaination

The `#[derive(Accounts)]` macro is used to define the account constraints for an Anchor program instruction. The Initialize struct defines the account constraints for the initialize instruction.

The Initialize struct has the following fields:

- `admin`: The account of the user who is initializing the program. This account must be a signer.
- `state`: The account that will store the state of the program. This account is initialized by the initialize instruction.
- `staking_token`: The account of the SPL token that will be used to stake.
- `admin_token_account`: The account of the SPL token account that the admin will use to receive staking rewards.
- `escrow_wallet`: The account of the SPL token account that will be used to hold the staked tokens. This account is initialized by the initialize instruction.
- `token_program`: The account of the Solana Token program.
- `system_program`: The account of the Solana System program.

The `#[account()]` macros on the `admin`, `state`, `staking_token`, `admin_token_account`, and `escrow_wallet` fields define the constraints for those accounts.

The `#[account(init, payer = admin, space = 8 + State::LEN, seeds = [b"ludon"], bump)]` macro on the state field indicates that the `state` account will be initialized by the `initialize` instruction. The `payer` argument specifies that the admin account will pay for the creation of the `state` account. The `space` argument specifies the size of the `state` account. The `seeds` argument specifies the seeds that will be used to generate the address of the `state` account. The `bump` argument is a unique value that is generated when the account is created. It is used to ensure that the account address is unique.

The `#[account(init, payer = admin, seeds = [b"hudon"], token::mint = staking_token, token::authority = state, bump)]` macro on the `escrow_wallet` field indicates that the `escrow_wallet` account will be initialized by the `initialize` instruction. The `payer` argument specifies that the `admin` account will pay for the creation of the `escrow_wallet` account. The `seeds` argument specifies the seeds that will be used to generate the address of the escrow_wallet account. The `token::mint` argument specifies that the `escrow_wallet` account must be a token account for the same SPL token as the staking_token account. The `token::authority` argument specifies that the `state` account must be the authority of the `escrow_wallet` account.

The `#[account(mut)]` macros on the `admin` and `admin_token_account` fields indicate that those accounts must be mutable. This is because the initialize instruction will modify those accounts.

The `#[program()]` macros on the `token_program` and `system_program` fields indicate that those accounts must be programs.
