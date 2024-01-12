import { Maestro, Translucent, TxComplete, fromText, MintingPolicy, PolicyId, toUnit } from "translucent-cardano";

async function mint(translucent: Translucent, tokenName: string, amount: number, metadata: string) : Promise<TxComplete> {
    const { paymentCredential } = translucent.utils.getAddressDetails(
	await translucent.wallet.address(),
    );

  const mintingPolicy: MintingPolicy = translucent.utils.nativeScriptFromJson(
    {
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCredential?.hash! },
        {
          type: "before",
          slot: translucent.utils.unixTimeToSlot(Date.now() + 1000000),
        },
      ],
    },
  );

  const policyId: PolicyId = translucent.utils.mintingPolicyToId(
    mintingPolicy,
  );

  const completedTx = await translucent
    .newTx()
    .mintAssets({ [toUnit(policyId, fromText(tokenName))]: BigInt(amount) })
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(mintingPolicy)
    .attachMetadata(674, { msg: metadata })
    .complete();

  return completedTx
}

async function main() {
    // Personal nico studio token. It works!
    const maestroToken = "ywMQ6vZRmxT9QCXxeXppU424zpqA37qM";

    const translucent = await Translucent.new(
      new Maestro({ network: "Mainnet", apiKey: maestroToken }),
	    "Preprod",
    );

    // Using the "frontend" we should change `selectWalletFromPrivateKey` to `selectWallet`.
    // Personal nico studio signing key. More info in the keys folder.
    translucent.selectWalletFromPrivateKey("ed25519_sk1vxkdk96c4e5k9ujdrgtqy6z2c3dhwg6m3cruyheurssv62pee79s6yme66");

    const completedTx = await mint(translucent, "BLEBLEBLEBLEBLE", 1, "Some info");
    console.log(`balanced tx cbor: ${completedTx.toString()}`);

    // Probably using `selectWallet` this signing part should be reviewed.
    const signedTx = await completedTx.sign().complete();
    console.log(`signed tx cbor: ${signedTx.toString()}`);

    // Uncomment this for actually submiting the transaction.
    //const txId = await signedTx.submit();
    //console.log(`tx id: ${txId.toString()}`);
}

main();






console.log("Hello World");







// import {
//   fromText,
//   Maestro,
//   MintingPolicy,
//   PolicyId,
//   TxHash,
//   Unit,
// } from "translucent-cardano";
// import { getInstanceWithWallet } from "./common.ts";

// /*
//   MintSimpleNFT Example
//   Mint or burn a simple NFT.
//  */

// // This will create a new Translucent instance either by creating a new Seed Phrase or using the one provided in seed.txt
// const translucent = await getInstanceWithWallet(
//   new Maestro({
//     network: "Preview",
//     apiKey: process.env.MAESTRO_API_KEY ?? "<API_KEY>",
//   }),
//   "Preview",
// );

// const address = await translucent.wallet.address();
// const { paymentCredential } = translucent.utils.getAddressDetails(address);

// const mintingPolicy: MintingPolicy = translucent.utils.nativeScriptFromJson({
//   type: "all",
//   scripts: [
//     { type: "sig", keyHash: paymentCredential?.hash! },
//     {
//       type: "before",
//       slot: translucent.utils.unixTimeToSlot(Date.now() + 10000000),
//     },
//   ],
// });

// const policyId: PolicyId = translucent.utils.mintingPolicyToId(mintingPolicy);

// await mintNFT("test");
// // await sleep(30000);
// // await burnNFT("test");

// export async function mintNFT(name: string): Promise<TxHash> {
//   const unit: Unit = policyId + fromText(name);

//   const tx = await translucent
//     .newTx()
//     .attachMintingPolicy(mintingPolicy)
//     .mintAssets({ [unit]: 1n })
//     .addSignerKey(paymentCredential?.hash!)
//     .validTo(Date.now() + 100000)
//     .complete();

//   const signedTx = await tx.sign().complete();

//   const txHash = await signedTx.submit();

//   return txHash;
// }

// export async function burnNFT(name: string): Promise<TxHash> {
//   const unit: Unit = policyId + fromText(name);

//   const tx = await translucent
//     .newTx()
//     .mintAssets({ [unit]: -1n })
//     .validTo(Date.now() + 100000)
//     .attachMintingPolicy(mintingPolicy)
//     .complete();

//   const signedTx = await tx.sign().complete();

//   const txHash = await signedTx.submit();

//   return txHash;
// }