const anchor = require("@project-serum/anchor");
const web3 = require("@solana/web3.js");
const spl = require("@solana/spl-token");
const { adminRaw, programIdRaw, mintIdRaw, stateSeed, escrowSeed } = require("./constants");

async function main() {

  const programId = new anchor.web3.PublicKey(programIdRaw);

  const idl = JSON.parse(
    require("fs").readFileSync("../target/idl/staking_contract.json", "utf8")
  );

  const admin_wallet = web3.Keypair.fromSecretKey(
    Uint8Array.from(
      adminRaw
    ));
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
  let wallet = new anchor.Wallet(admin_wallet);
  let provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

  let program = new anchor.Program(
    idl,
    programId,
    provider,
  );

  const mint = new anchor.web3.PublicKey(mintIdRaw);

  const adminTokenAccount = spl.getAssociatedTokenAddressSync(
    mint,
    admin_wallet.publicKey,
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

  const slot = await connection.getSlot();
  const timestamp = await connection.getBlockTime(slot);
  let startTime = new anchor.BN(timestamp + 10);
  let endTime = new anchor.BN(timestamp + 320);

  const tx = await program.methods.initialize(startTime, endTime, stateBump).accounts({
    admin: admin_wallet.publicKey,
    state: statePubkey,
    stakingToken: mint,
    adminTokenAccount: adminTokenAccount,
    escrowWallet: escrowPubkey,
    tokenProgram: spl.TOKEN_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
  }).signers([admin_wallet]).rpc();
  console.log("tx hash", tx);
}

main()