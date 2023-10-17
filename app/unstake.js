const anchor = require("@project-serum/anchor");
const web3 = require("@solana/web3.js");
const spl = require("@solana/spl-token");
const { admin, user1, user2, user3, user4, user5 } = require("./keypairs");

async function main() {

  const programId = new anchor.web3.PublicKey("");

  const idl = JSON.parse(
    require("fs").readFileSync("../target/idl/staking_contract.json", "utf8")
  );

  const user2Wallet = web3.Keypair.fromSecretKey(
    Uint8Array.from(
      user2
    ));

  const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

  let wallet = new anchor.Wallet(user2Wallet);
  let provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

  let program = new anchor.Program(
    idl,
    programId,
    provider,
  );

  const mint = new anchor.web3.PublicKey("");

  const toTokenAccount = spl.getAssociatedTokenAddressSync(
    mint,
    user2Wallet.publicKey,
  );

  const [statePubkey, stateBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("ltest"),
    ],
    programId,
  );

  console.log(statePubkey);

  const [escrowPubkey, escrowBump] = anchor.
    web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("testh"),
      ],
      programId,
    );

    const [stakingInfoPda, stakingInfoBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("ptest"),
      ],
      programId,
    );
  

  const tx = await program.methods.unstake(stateBump, stakingInfoBump, escrowBump).accounts({
    user: user2Wallet.publicKey,
    state: statePubkey,
    stakingToken: mint,
    stakingInfoAccount: stakingInfoPda,
    escrowWallet: escrowPubkey,
    toTokenAccount: toTokenAccount,
    tokenProgram: spl.TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
  }).signers([user2Wallet]).rpc();
  console.log("tx hash", tx);
}

main()