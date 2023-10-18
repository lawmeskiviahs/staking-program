const anchor = require("@project-serum/anchor");
const spl = require("@solana/spl-token");
const { stateSeedTest, escrowSeedTest, stakingInfoPdaSeedTest } = require("../app/constants");
const assert = require("chai");
describe("staking_program", async () => {
    const Decimal = 100000000;
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const programId = new anchor.web3.PublicKey("9amNgcg3UHf5udr3gJ4xJpgqUqx3BF1i9vB5Np8xTH2i");
    const idl = await JSON.parse(
        require("fs").readFileSync("target/idl/staking_contract.json", "utf8")
    );
    let program = new anchor.Program(
        idl,
        programId,
        provider,
    );
    let admin = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
        admin.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
    );
    const mint = new anchor.web3.Keypair();
    const lamportsForMint = await provider.connection.getMinimumBalanceForRentExemption(spl.MintLayout.span);
    let tx = new anchor.web3.Transaction();
    tx.add(
        anchor.web3.SystemProgram.createAccount({
            programId: spl.TOKEN_PROGRAM_ID,
            space: spl.MintLayout.span,
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: mint.publicKey,
            lamports: lamportsForMint,
        })
    )
    tx.add(
        spl.createInitializeMintInstruction(
            mint.publicKey,
            8,
            admin.publicKey,
            admin.publicKey,
            spl.TOKEN_PROGRAM_ID,
        )
    );
    await provider.sendAndConfirm(tx, [mint]);
    let user1 = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
        user1.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
    );
    let user2 = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
        user2.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
    );
    let user3 = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
        user3.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
    );
    let user4 = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
        user4.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
    );
    let user5 = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
        user5.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
    );
    let adminAta = await spl.createAssociatedTokenAccount(
        provider.connection, // provider.connection
        admin, // fee payer
        mint.publicKey, // mint
        admin.publicKey // owner,
    );
    var amount = 500000000 * Decimal;
    var txhashMintToAdmin = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint
        adminAta, // receiver associated token account
        admin.publicKey, // mint authority
        amount, // amount. 
        8 // decimals
    );
    let user1Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint
        user1.publicKey // owner,
    );
    amount = 100000000 * Decimal;
    let txhashMintToUser1 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint
        user1Ata, // receiver associated token account
        admin, // mint authority
        amount, // amount.
        8 // decimals
    );
    let user2Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint
        user2.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    let txhashMintToUser2 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user2Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount.
        8 // decimals
    );
    let user3Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user3.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    let txhashMintToUser3 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user3Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount.
        8 // decimals
    );
    let user4Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user4.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    let txhashMintToUser4 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user4Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount. if your decimals is 8, you mint.publicKey 10^8 for 1 token.
        8 // decimals
    );
    let user5Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user5.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    let txhashMintToUser5 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user5Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount.
        8 // decimals
    );
    // find associated token account for admin
    const adminTokenAccount = spl.getAssociatedTokenAddressSync(
        mint.publicKey,
        admin.publicKey,
    );
    const [statePubkey, stateBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from(stateSeedTest),
        ],
        programId,
    );
    const [escrowPubkey, escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from(escrowSeedTest),
        ],
        programId,
    );
    try {
        const slot = await provider.connection.getSlot();
        const timestamp = await provider.connection.getBlockTime(slot);
        let startTime = new anchor.BN(timestamp + 10);
        let endTime = new anchor.BN(timestamp + 320);
        const txs = await program.methods.initialize(startTime, endTime, stateBump).accounts({
            admin: admin.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            adminTokenAccount: adminTokenAccount,
            escrowWallet: escrowPubkey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([admin]).rpc();
        console.log("Init success tx hash: ", txs);
    } catch (e) {
        console.log("init fail tx error: ", e);
    }
    try {
        const slot = await provider.connection.getSlot();
        const timestamp = await provider.connection.getBlockTime(slot);
        let startTime = new anchor.BN(timestamp + 10);
        let endTime = new anchor.BN(timestamp + 320);
        const txs = await program.methods.initialize(startTime, endTime, stateBump).accounts({
            admin: admin.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            adminTokenAccount: adminTokenAccount,
            escrowWallet: escrowPubkey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([admin]).rpc();
        console.log("Reinitialize fail tx hash", txs);
    } catch (e) {
        console.log("Cannot reinitialize again success error: ", e);
    }
    try {
        const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(stakingInfoPdaSeedTest),
                user1.publicKey.toBuffer(),
            ],
            programId,
        );
        const tx = await program.methods.unstake(stateBump, stakingInfoBump, escrowBump).accounts({
            user: user1.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            stakingInfoAccount: stakingInfoPda,
            escrowWallet: escrowPubkey,
            toTokenAccount: user1Ata,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([user1]).rpc();
        console.log("Unstake before staking fail tx hash: ", tx);
    } catch (e) {
        console.log("Unstake before staking success error: ", e);
    }
    try {
        const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(stakingInfoPdaSeedTest),
                user1.publicKey.toBuffer(),
            ],
            programId,
        );
        const tx = await program.methods.getRewards(stateBump, stakingInfoBump, escrowBump).accounts({
            user: user1.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            toTokenAccount: user1Ata,
            stakingInfoAccount: stakingInfoPda,
            escrowWallet: escrowPubkey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([user1]).rpc();
        console.log("Getting rewards before staking fail tx hash: ", tx);
    } catch (e) {
        console.log("Getting rewards before staking success tx error: ", e);
    }
    try {
        const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(stakingInfoPdaSeedTest),
                user1.publicKey.toBuffer(),
            ],
            programId,
        );
        let amount = new anchor.BN(300);
        const tx = await program.methods.stake(amount, stateBump, escrowBump).accounts({
            user: user1.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            fromTokenAccount: user1Ata,
            stakingInfoAccount: stakingInfoPda,
            escrowWallet: escrowPubkey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([user1]).rpc();
        console.log("Staking before start time fail tx hash: ", tx);
    } catch (e) {
        console.log("Staking before start time success error: ", e);
    }
    try {
        const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(stakingInfoPdaSeedTest),
                user1.publicKey.toBuffer(),
            ],
            programId,
        );
        let amount = new anchor.BN(300);
        setTimeout(async () => {
            const tx = await program.methods.stake(amount, stateBump, escrowBump).accounts({
                user: user1.publicKey,
                state: statePubkey,
                stakingToken: mint.publicKey,
                fromTokenAccount: user1Ata,
                stakingInfoAccount: stakingInfoPda,
                escrowWallet: escrowPubkey,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
            }).signers([user1]).rpc();
        }, 10000)
        console.log("stake success tx hash: ", tx);
    } catch (e) {
        console.log("stake fail error: ", e);
    }
    try {
        const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(stakingInfoPdaSeedTest),
                admin.publicKey.toBuffer(),
            ],
            programId,
        );
        let amount = new anchor.BN(300);
        const tx = await program.methods.stake(amount, stateBump, escrowBump).accounts({
            user: admin.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            fromTokenAccount: adminAta,
            stakingInfoAccount: stakingInfoPda,
            escrowWallet: escrowPubkey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([admin]).rpc();
        console.log("admin cannot stake fail tx hash: ", tx);
    } catch (e) {
        console.log("admin cannot stake success error: ", e);
    }
    try {
        const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(stakingInfoPdaSeedTest),
                user1.publicKey.toBuffer(),
            ],
            programId,
        );
        const tx = await program.methods.unstake(stateBump, stakingInfoBump, escrowBump).accounts({
            user: user1.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            stakingInfoAccount: stakingInfoPda,
            escrowWallet: escrowPubkey,
            toTokenAccount: user1Ata,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([user1]).rpc();
        console.log("Unstake before bonding period fail tx hash: ", tx);
    } catch (e) {
        console.log("Unstake before bonding period success error: ", e);
    }
    try {
        setTimeout(async () => {
            const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
                [
                    Buffer.from(stakingInfoPdaSeedTest),
                    user1.publicKey.toBuffer(),
                ],
                programId,
            );
            const tx = await program.methods.unstake(stateBump, stakingInfoBump, escrowBump).accounts({
                user: user1.publicKey,
                state: statePubkey,
                stakingToken: mint.publicKey,
                stakingInfoAccount: stakingInfoPda,
                escrowWallet: escrowPubkey,
                toTokenAccount: user1Ata,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
            }).signers([user1]).rpc();
            console.log("unstake success tx hash: ", tx);
        }, 300000)
    } catch (e) {
        console.log("unstaking fail error: ", e);
    }
    try {
        setTimeout(async () => {}, 400000)
    } catch (e) {}
    try {
        const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(stakingInfoPdaSeedTest),
                user1.publicKey.toBuffer(),
            ],
            programId,
        );
        const tx = await program.methods.getRewards(stateBump, stakingInfoBump, escrowBump).accounts({
            user: user1.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            toTokenAccount: user1Ata,
            stakingInfoAccount: stakingInfoPda,
            escrowWallet: escrowPubkey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([user1]).rpc();
        console.log("get rewards before stake end time fail tx hash: ", tx);  
    } catch (e) {
        console.log("get rewards before stake end time success error: ", e);
    }
    try {
        setTimeout(async () => {
            const [stakingInfoPda, stakingInfoBump] = anchor.web3.PublicKey.findProgramAddressSync(
                [
                    Buffer.from(stakingInfoPdaSeedTest),
                    user1.publicKey.toBuffer(),
                ],
                programId,
            );
            const tx = await program.methods.getRewards(stateBump, stakingInfoBump, escrowBump).accounts({
                user: user1.publicKey,
                state: statePubkey,
                stakingToken: mint.publicKey,
                toTokenAccount: user1Ata,
                stakingInfoAccount: stakingInfoPda,
                escrowWallet: escrowPubkey,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
            }).signers([user1]).rpc();
            console.log("get rewards success tx hash: ", tx);
        }, 400000)
    } catch (e) {
        console.log("get rewards fail error: ", e);
    }
});
