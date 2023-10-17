const solana = require("@solana/web3.js");
const splToken = require("@solana/spl-token");

(async () => {

    // connection to cluster
    const connection = new solana.Connection(solana.clusterApiUrl("devnet"), "confirmed");

    // generating a fresh Keypair for the admin
    let admin = solana.Keypair.generate();
    console.log("admin secretKey ", admin.secretKey, " admin publicKey ", admin.publicKey);
    // requesting an airdrop of 2 SOL into the admin's account for paying fees
    const airdropSignature = await connection.requestAirdrop(
        admin.publicKey,
        2 * solana.LAMPORTS_PER_SOL
    );
    console.log("airdrop txHAsh: ", airdropSignature);
    // generating 5 fresh keypairs fot the users
    let user1 = solana.Keypair.generate();
    console.log("user1 secretKey ", user1.secretKey, " user1 publicKey ", user1.publicKey);
    let user2 = solana.Keypair.generate();
    console.log("user2 secretKey ", user2.secretKey, " user2 publicKey ", user2.publicKey);
    let user3 = solana.Keypair.generate();
    console.log("user3 secretKey ", user3.secretKey, " user3 publicKey ", user3.publicKey);
    let user4 = solana.Keypair.generate();
    console.log("user4 secretKey ", user4.secretKey, " user4 publicKey ", user4.publicKey);
    let user5 = solana.Keypair.generate();
    console.log("user2 secretKey ", user5.secretKey, " user5 publicKey ", user5.publicKey);

    // creating a fresh token
    let mintPubkey = await splToken.createMint(
        connection, // conneciton
        admin, // fee payer
        admin.publicKey, // mint authority
        admin.publicKey, // freeze authority
        8 // decimals
    );
    console.log(`mintPubKey: ${mintPubkey.toBase58()}`);

    // creating an asociated token account for the admin to hold the token we just created
    let adminAta = await splToken.createAssociatedTokenAccount(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        admin.publicKey // owner,
    );

    let amount = 500000000 * solana.LAMPORTS_PER_SOL;

    // minting 500Million fresh tokens into the account of the admin
    let txhashMintToAdmin = await splToken.mintToChecked(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        adminAta, // receiver associated token account
        admin, // mint authority
        amount, // amount. 
        8 // decimals
    );
    console.log("Mint ", amount, " tokens to admin's ATA: ", txhashMintToAdmin);

    // creating an asociated token account for the user1 to hold the token we just created
    let user1Ata = await splToken.createAssociatedTokenAccount(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user1.publicKey // owner,
    );

    amount = 100000000 * solana.LAMPORTS_PER_SOL;

    // minting 100Million fresh tokens into the account of the user1
    let txhashMintToUser1 = await splToken.mintToChecked(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user1Ata, // receiver associated token account
        admin, // mint authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint ", amount, " tokens to user1 ATA: ", txhashMintToUser1);

    // creating an asociated token account for the user2 to hold the token we just created
    let user2Ata = await splToken.createAssociatedTokenAccount(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user2.publicKey // owner,
    );

    amount = 100000000 * solana.LAMPORTS_PER_SOL;

    // minting 100Million fresh tokens into the account of the user2
    let txhashMintToUser2 = await splToken.mintToChecked(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user2Ata, // receiver associated token account
        admin, // mint authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint ", amount, " tokens to user2 ATA: ", txhashMintToUser2);

    // creating an asociated token account for the user3 to hold the token we just created
    let user3Ata = await splToken.createAssociatedTokenAccount(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user3.publicKey // owner,
    );

    amount = 100000000 * solana.LAMPORTS_PER_SOL;
    
    // minting 100Million fresh tokens into the account of the user3
    let txhashMintToUser3 = await splToken.mintToChecked(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user3Ata, // receiver associated token account
        admin, // mint authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint ", amount, " tokens to user3 ATA: ", txhashMintToUser3);

    // creating an asociated token account for the user4 to hold the token we just created
    let user4Ata = await splToken.createAssociatedTokenAccount(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user4.publicKey // owner,
    );

    amount = 100000000 * solana.LAMPORTS_PER_SOL;

    // minting 100Million fresh tokens into the account of the user4
    let txhashMintToUser4 = await splToken.mintToChecked(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user4Ata, // receiver associated token account
        admin, // mint authority
        amount, // amount. if your decimals is 8, you mint 10^8 for 1 token.
        8 // decimals
    );
    console.log("Mint ", amount, " tokens to user4 ATA: ", txhashMintToUser4);

    // creating an asociated token account for the user5 to hold the token we just created
    let user5Ata = await splToken.createAssociatedTokenAccount(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user5.publicKey // owner,
    );

    amount = 100000000 * solana.LAMPORTS_PER_SOL;

    // minting 100Million fresh tokens into the account of the user5
    let txhashMintToUser5 = await splToken.mintToChecked(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user5Ata, // receiver associated token account
        admin, // mint authority
        amount, // amount.
        8 // decimals
    );
    console.log("Mint ", amount, " tokens to user5 ATA: ", txhashMintToUser5);

    // setting the mint authority of the token to 'null' so that no new tokens can be minted 
    let freezeMintSignature = await splToken.setAuthority(
        connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        admin, // current authority
        splToken.AuthorityType.MintTokens, // type of authority to set
        null, // this sets the mint authority to null so nobody can mint
    );
    console.log("freeze mint signature: ", freezeMintSignature);

    // geeting mint account information to display the current supply of the token
    let mintAccount = await splToken.getMint(connection, mintPubkey);
    console.log("Total supply of the token", mintAccount.supply);

})();