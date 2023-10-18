use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, Mint, TokenAccount, Token};
declare_id!("9amNgcg3UHf5udr3gJ4xJpgqUqx3BF1i9vB5Np8xTH2i");
#[error_code]
pub enum Errors {
    #[msg("Currently in bonding period")]
    InBondingPeriod,
    #[msg("Staking period expired")]
    StakingExpired,
    #[msg("Staking period not ended")]
    StakingNotEnded,
    #[msg("Staking period not started")]
    StakingNotStarted,
    #[msg("Current staked amount zero")]
    ZeroStaked,
    #[msg("Admin is not allowed to stake")]
    AdminCannotStake,
}
#[program]
pub mod staking_contract {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, start_time: u64, end_time: u64, state_bump: u8) -> Result<()> {
        let state_account: &mut Account<State> = &mut ctx.accounts.state;
        state_account.admin = ctx.accounts.admin.key();
        state_account.start_time = start_time;
        state_account.end_time = end_time;
        state_account.staking_token = ctx.accounts.staking_token.key();
        let amount: u64 = 100000000*100000000;
        let bump_vector = state_bump.to_le_bytes();
        let inner = vec![
            b"ltaste".as_ref(),
            bump_vector.as_ref(),
        ];
        let outer = vec![inner.as_slice()];
        let transfer_instruction = Transfer {
            from: ctx.accounts.admin_token_account.to_account_info(),
            to: ctx.accounts.escrow_wallet.to_account_info(),
            authority: ctx.accounts.admin.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice(),
        );
        token::transfer(cpi_context,amount)?;
        Ok(())
    }
    pub fn stake(ctx: Context<Stake>, amount: u64, state_bump:u8, _escrow_bump:u8) -> Result<()> {
        let clock = Clock::get()?; 
        let state_account: &Account<State> = &ctx.accounts.state;
        require!(ctx.accounts.user.key()!=state_account.admin, Errors::AdminCannotStake);
        require!((clock.unix_timestamp as u64)>state_account.start_time, Errors::StakingNotStarted);
        require!((clock.unix_timestamp as u64)<state_account.end_time, Errors::StakingExpired);
        let stake_info_pda: &mut Account<UserInfo> = &mut ctx.accounts.staking_info_account;
        if stake_info_pda.amount>0 {
            let time_passed = (state_account.end_time - state_account.start_time) - (state_account.end_time - stake_info_pda.deposit_timestamp);
            let interest = (stake_info_pda.amount*12)/3110400000;
            let rewards =  time_passed * interest;
            stake_info_pda.total_reward+=rewards;
        }
        let bump_vector = state_bump.to_le_bytes();
        let inner = vec![
            b"ltaste".as_ref(),
            bump_vector.as_ref(),
        ];
        let outer = vec![inner.as_slice()];
        let transfer_instruction = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.escrow_wallet.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice(),
        );
        let amount_with_decimal = amount * 100000000;
        token::transfer(cpi_context,amount_with_decimal)?;
        stake_info_pda.amount += amount_with_decimal;
        stake_info_pda.deposit_timestamp = clock.unix_timestamp as u64;
        Ok(())
    }
    pub fn unstake(ctx: Context<Unstake>, state_bump:u8, _escrow_bump: u8, _staker_bump: u8) -> Result<()> {
        let clock = Clock::get()?;
        let state_account: &Account<State> = &ctx.accounts.state;
        let stake_info_pda: &mut Account<UserInfo> = &mut ctx.accounts.staking_info_account;
        require!((clock.unix_timestamp as u64)>state_account.start_time, Errors::StakingNotStarted);
        require!(stake_info_pda.amount!=0, Errors::ZeroStaked);
        require!((clock.unix_timestamp as u64)>stake_info_pda.deposit_timestamp+300, Errors::InBondingPeriod);
        let time_passed = (state_account.end_time - state_account.start_time) - (state_account.end_time - stake_info_pda.deposit_timestamp);
        let interest = (stake_info_pda.amount*12)/3110400000;
        let rewards =  time_passed * interest;
        stake_info_pda.total_reward+=rewards;
        let bump_vector = state_bump.to_le_bytes();
        let inner = vec![
            b"ltaste".as_ref(),
            bump_vector.as_ref(),
        ];
        let outer = vec![inner.as_slice()];
        let transfer_instruction = Transfer{
            from: ctx.accounts.escrow_wallet.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.state.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice(),
        );
        anchor_spl::token::transfer(cpi_ctx, stake_info_pda.amount)?;
        stake_info_pda.amount=0;
        stake_info_pda.deposit_timestamp=0;
        Ok(())
    }
    pub fn get_rewards(ctx: Context<GetRewards>, state_bump:u8, _escrow_bump: u8, _staker_bump: u8) -> Result<()> {
        let clock = Clock::get()?;
        let stake_info_pda: &mut Account<UserInfo> = &mut ctx.accounts.staking_info_account;
        let state_account: &Account<State> = &ctx.accounts.state;
        require!(clock.unix_timestamp as u64>state_account.end_time, Errors::StakingNotEnded);
        let time_passed = (state_account.end_time - state_account.start_time) - (state_account.end_time - stake_info_pda.deposit_timestamp);
        if stake_info_pda.amount>0 {
            let interest = (stake_info_pda.amount*12)/3110400000;
            let rewards =  time_passed * interest;
            stake_info_pda.total_reward+=rewards;
            let bump_vector = state_bump.to_le_bytes();
            let inner = vec![
            b"ltaste".as_ref(),
            bump_vector.as_ref(),
        ];
        let outer = vec![inner.as_slice()];
        let transfer_instruction = Transfer{
            from: ctx.accounts.escrow_wallet.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.state.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice(),
        );
        anchor_spl::token::transfer(cpi_ctx, stake_info_pda.amount)?;
        }
        let bump_vector = state_bump.to_le_bytes();
        let inner = vec![
            b"ltaste".as_ref(),
            bump_vector.as_ref(),
        ];
        let outer = vec![inner.as_slice()];
        let transfer_instruction = Transfer{
            from: ctx.accounts.escrow_wallet.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.state.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice(),
        );
        anchor_spl::token::transfer(cpi_ctx, stake_info_pda.total_reward)?;
        stake_info_pda.amount = 0;
        stake_info_pda.deposit_timestamp = 0;
        stake_info_pda.total_reward = 0;
        Ok(())
    }
}
#[derive(Accounts)]
pub struct Initialize <'info>{
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = 8 + State::LEN,
        seeds=[
            b"ltaste"
        ],
        bump,
    )]
    pub state: Account<'info, State>,
    pub staking_token: Account<'info, Mint>,
    #[account(mut)]
    pub admin_token_account: Account<'info, TokenAccount>,
    #[account(
        init, 
        payer = admin,
        seeds = [
            b"tasteh"
        ], 
        token::mint = staking_token,
        token::authority = state, 
        bump)]
    pub escrow_wallet: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
    pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        seeds=[
            b"ltaste"
            ],
        bump ,
    )]
    pub state: Account<'info, State>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserInfo::LEN,
        seeds=[
            b"ptaste",
            user.key().as_ref()
        ],
        bump,
    )]
    pub staking_info_account: Account<'info, UserInfo>,
    pub staking_token: Account<'info, Mint>,
    #[account(
        mut,
        constraint=from_token_account.owner == user.key(),
        constraint=from_token_account.mint == staking_token.key()
    )]
    pub from_token_account: Account<'info, TokenAccount>,
    #[account(mut,
        seeds = [
            b"tasteh"
        ], 
        bump)]
    pub escrow_wallet: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account( 
        seeds=[
            b"ltaste"
            ],
        bump,
    )]
    pub state: Account<'info, State>,
    pub staking_token: Account<'info, Mint>,
    #[account(mut,
        seeds=[
            b"ptaste",
            user.key().as_ref()
        ],
        bump,
    )]
    pub staking_info_account: Account<'info, UserInfo>,
    #[account(mut,
        seeds = [
            b"tasteh"
            ], 
        bump)]
    pub escrow_wallet: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint=to_token_account.owner == user.key(),
        constraint=to_token_account.mint == staking_token.key()
    )]
    pub to_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct GetRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account( 
        seeds = [
            b"ltaste"
            ],
        bump,
    )]
    pub state: Account<'info, State>,
    pub staking_token: Account<'info, Mint>,
    #[account(mut,
        seeds=[
            b"ptaste",
            user.key().as_ref()
            ],
        bump,
    )]
    pub staking_info_account: Account<'info, UserInfo>,
    #[account(mut,
        seeds = [
            b"tasteh"
            ], 
        bump)]
    pub escrow_wallet: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint=to_token_account.owner == user.key(),
        constraint=to_token_account.mint == staking_token.key()
    )]
    pub to_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
#[account]
#[derive(Default)]
pub struct State {
    pub admin: Pubkey,
    pub start_time: u64,
    pub end_time: u64,
    pub staking_token: Pubkey,
}
#[account]
#[derive(Default)]
pub struct UserInfo {
    pub amount: u64,
    pub deposit_timestamp: u64,
    pub total_reward: u64,
}
impl State {
    pub const LEN: usize = 32 + 8 + 8 + 32;
}
impl UserInfo {
    pub const LEN: usize = 8 + 8 + 8;
}