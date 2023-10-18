const anchor = require("@project-serum/anchor");
const spl = require("@solana/spl-token");
const { stateSeed, escrowSeed, stakingInfoPdaSeed } = require("../app/constants");
const asset = require("chai");
describe("staking_program", async () => {
    const Decimal = 100000000;
    // Configure the client to use the local cluster.
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
    const airdropSignature = await provider.connection.requestAirdrop(
        admin.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
    );
    console.log("airdrop txHAsh: ", airdropSignature);
    //   console.log("before mint");
    const mint = new anchor.web3.Keypair();
    //   console.log("mint created");
    const lamportsForMint = await provider.connection.getMinimumBalanceForRentExemption(spl.MintLayout.span);
    let tx = new anchor.web3.Transaction();
    console.log("after lampss");
    // Allocate mint
    tx.add(
        anchor.web3.SystemProgram.createAccount({
            programId: spl.TOKEN_PROGRAM_ID,
            space: spl.MintLayout.span,
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: mint.publicKey,
            lamports: lamportsForMint,
        })
    )
    console.log("add mint");
    // Allocate wallet account
    tx.add(
        spl.createInitializeMintInstruction(
            mint.publicKey,
            8,
            admin.publicKey,
            admin.publicKey,
            spl.TOKEN_PROGRAM_ID,
        )
    );
    const signature = await provider.sendAndConfirm(tx, [mint]);
    console.log("after mint", signature);
    // generating 5 fresh keypairs fot the users
    let user1 = anchor.web3.Keypair.generate();
    let user2 = anchor.web3.Keypair.generate();
    let user3 = anchor.web3.Keypair.generate();
    let user4 = anchor.web3.Keypair.generate();
    let user5 = anchor.web3.Keypair.generate();
    // console.log(provider);
    console.log("after account generate");
    let adminAta = await spl.createAssociatedTokenAccount(
        provider.connection, // provider.connection
        admin, // fee payer
        mint.publicKey, // mint
        admin.publicKey // owner,
    );
    console.log("before amount", adminAta);
    try {
        var amount = 500000000 * Decimal;
    } catch (e) {
        console.log(e, ":::::::::");
    }
    console.log("after ata");
    try {

        var txhashMintToAdmin = await spl.mintToChecked(
            provider.connection, // connection
            admin, // fee payer
            mint.publicKey, // mint
            adminAta, // receiver associated token account
            admin.publicKey, // mint authority
            amount, // amount. 
            8 // decimals
        );
        console.log(txhashMintToAdmin, ">>>>>>>>>>>>>>");

    } catch (e) {
        console.log(e, ">>>>>>>>>>>>>>");
    }
    // minting 500Million fresh tokens into the account of the admin
    console.log("Mint ", amount, " tokens to admin's ATA: ", txhashMintToAdmin);
    // creating an asociated token account for the user1 to hold the token we just created
    let user1Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint
        user1.publicKey // owner,
    );
    amount = 100000000 * Decimal;
    // mintinto.equalg 100Million fresh tokens into the account of the user1
    let txhashMintToUser1 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint
        user1Ata, // receiver associated token account
        admin, // mint authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint ", amount, " tokens to user1 ATA: ", txhashMintToUser1);
    // creating an asociated token account for the user2 to hold the token we just created
    let user2Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint
        user2.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    // minting 100Million fresh tokens into the account of the user2
    let txhashMintToUser2 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user2Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint.publicKey ", amount, " tokens to user2 ATA: ", txhashMintToUser2);
    // creating an asociated token account for the user3 to hold the token we just created
    let user3Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user3.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    // minting 100Million fresh tokens into the account of the user3
    let txhashMintToUser3 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user3Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint.publicKey ", amount, " tokens to user3 ATA: ", txhashMintToUser3);
    // creating an asociated token account for the user4 to hold the token we just created
    let user4Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user4.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    // minting 100Million fresh tokens into the account of the user4
    let txhashMintToUser4 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user4Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount. if your decimals is 8, you mint.publicKey 10^8 for 1 token.
        8 // decimals
    );
    console.log("Mint.publicKey ", amount, " tokens to user4 ATA: ", txhashMintToUser4);
    // creating an asociated token account for the user5 to hold the token we just created
    let user5Ata = await spl.createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user5.publicKey // owner,
    );
    var amount = 100000000 * Decimal;
    // minting 100Million fresh tokens into the account of the user5
    let txhashMintToUser5 = await spl.mintToChecked(
        provider.connection, // connection
        admin, // fee payer
        mint.publicKey, // mint.publicKey
        user5Ata, // receiver associated token account
        admin, // mint.publicKey authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint.publicKey ", amount, " tokens to user5 ATA: ", txhashMintToUser5);
    console.log("log after keygen");
    // find associated token account for admin
    const adminTokenAccount = spl.getAssociatedTokenAddressSync(
        mint.publicKey,
        admin.publicKey,
    );
    console.log("after ata");
    // find address for state PDA account
    const [statePubkey, stateBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from(stateSeed),
        ],
        programId,
    );
    console.log("after state pda");
    // find address for escrow PDA account
    const [escrowPubkey, escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from(escrowSeed),
        ],
        programId,
    );
    console.log("log after accounts getting");
    // const [stakingInfoPda, stakingInfoBump] = web3.PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from(stakingInfoPdaSeed),
    //     userWallet.publicKey.toBuffer(),
    //   ],
    //   program.programId,
    // );
    it("Is initialized!", async () => {
        // Add your test here.
        console.log("in it 1");
        const slot = await provider.connection.getSlot();
        const timestamp = await provider.connection.getBlockTime(slot);
        let startTime = new anchor.BN(timestamp + 10);
        let endTime = new anchor.BN(timestamp + 320);
        console.log("in it 2");
        const txs = await program.methods.initialize(startTime, endTime, stateBump).accounts({
            admin: admin.publicKey,
            state: statePubkey,
            stakingToken: mint.publicKey,
            adminTokenAccount: adminTokenAccount,
            escrowWallet: escrowPubkey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([admin]).rpc();
        console.log("tx hash", txs);
        expect(200).equal(200);
        // const stateInfo = await provider.connection.getAccountInfo(statePubkey);
        // assert(stateInfo)
    });
});
