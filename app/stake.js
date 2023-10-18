const anchor = require("@project-serum/anchor");
const web3 = require("@solana/web3.js");
const spl = require("@solana/spl-token");
const { adminRaw, user1Raw, user2Raw, user3Raw, user4Raw, user5Raw, programIdRaw, mintIdRaw, stateSeed, escrowSeed, stakingInfoPdaSeed } = require("./constants");

async function main() {

  const programId = new anchor.web3.PublicKey(programIdRaw);

  const idl = JSON.parse(
    require("fs").readFileSync("../target/idl/staking_contract.json", "utf8")
  );

  const userWallet = web3.Keypair.fromSecretKey(
    Uint8Array.from(
      user2Raw
    ));

  const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
  // const airdropSignature = await connection.requestAirdrop(
  //   admin.publicKey,
  //   1 * web3.LAMPORTS_PER_SOL
  // );
  let wallet = new anchor.Wallet(userWallet);
  let provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

  let program = new anchor.Program(
    idl,
    programId,
    provider,
  );

  const mint = new anchor.web3.PublicKey(mintIdRaw);

  const fromTokenAccount = spl.getAssociatedTokenAddressSync(
    mint,
    userWallet.publicKey,
  );

  const [statePubkey, stateBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(stateSeed),
    ],
    programId,
  );

  const [escrowPubkey, escrowBump] = anchor.
    web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(escrowSeed),
      ],
      programId,
    );

  const [stakingInfoPda, stakingInfoBump] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(stakingInfoPdaSeed),
      userWallet.publicKey.toBuffer(),
    ],
    programId,
  );

  let amount = new anchor.BN(300);
  const tx = await program.methods.stake(amount, stateBump, escrowBump).accounts({
    user: userWallet.publicKey,
    state: statePubkey,
    stakingToken: mint,
    fromTokenAccount: fromTokenAccount,
    stakingInfoAccount: stakingInfoPda,
    escrowWallet: escrowPubkey,
    tokenProgram: spl.TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
  }).signers([userWallet]).rpc();
  console.log("tx hash", tx);
}

main()