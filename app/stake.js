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
  // const airdropSignature = await connection.requestAirdrop(
  //   admin.publicKey,
  //   1 * web3.LAMPORTS_PER_SOL
  // );
  let wallet = new anchor.Wallet(user2Wallet);
  let provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

  let program = new anchor.Program(
    idl,
    programId,
    provider,
  );

  const mint = new anchor.web3.PublicKey("");

  const fromTokenAccount = spl.getAssociatedTokenAddressSync(
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

  let amount = new anchor.BN(300);
  const tx = await program.methods.stake(amount, stateBump, escrowBump).accounts({
    user: user2Wallet.publicKey,
    state: statePubkey,
    stakingToken: mint,
    fromTokenAccount: fromTokenAccount,
    stakingInfoAccount: stakingInfoPda,
    escrowWallet: escrowPubkey,
    tokenProgram: spl.TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
  }).signers([user2Wallet]).rpc();
  console.log("tx hash", tx);
}

main()