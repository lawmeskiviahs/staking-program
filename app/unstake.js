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
  let wallet = new anchor.Wallet(userWallet);
  let provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
  let program = new anchor.Program(
    idl,
    programId,
    provider,
  );
  const mint = new anchor.web3.PublicKey(mintIdRaw);
  const toTokenAccount = spl.getAssociatedTokenAddressSync(
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
  const tx = await program.methods.unstake(stateBump, stakingInfoBump, escrowBump).accounts({
    user: userWallet.publicKey,
    state: statePubkey,
    stakingToken: mint,
    stakingInfoAccount: stakingInfoPda,
    escrowWallet: escrowPubkey,
    toTokenAccount: toTokenAccount,
    tokenProgram: spl.TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
  }).signers([userWallet]).rpc();
  console.log("tx hash", tx);
}
main()