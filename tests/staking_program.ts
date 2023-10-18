import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
const web3 = require("@solana/web3.js");
const spl = require("@solana/spl-token");
import { StakingContract } from "../target/types/staking_contract";

describe("staking_program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
  const program = anchor.workspace.StakingProgram as Program<StakingContract>;
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
        user2Wallet.publicKey.toBuffer(),
      ],
      programId,
    );

  it("Is initialized!", async () => {
    // Add your test here.

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
  });
});
