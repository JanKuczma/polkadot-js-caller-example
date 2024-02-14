import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { stringToU8a, u8aToHex } from "@polkadot/util";
import CallerConstructors from "../types/constructors/caller_contract";
import CalleeConstructors from "../types/constructors/callee_contract";
import TokenConstructors from "../types/constructors/token";
import CallerContract from "../types/contracts/caller_contract";
import CalleeContract from "../types/contracts/callee_contract";
import TokenContract from "../types/contracts/token";
import { Transaction } from "../types/types-arguments/caller_contract";
import { Abi } from "@polkadot/api-contract";
import { KeyringPair } from "@polkadot/keyring/types";
import { HexString } from "@polkadot/util/types";
import { ContractFile as CalleeAbi } from "../types/contract-info/caller_contract";
import { ContractFile as CallerAbi } from "../types/contract-info/caller_contract";
import { ContractFile as TokenAbi } from "../types/contract-info/token";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { uploadCode } from "./utils";
import { SecretStruct } from "../types/types-arguments/callee_contract";

async function main(): Promise<void> {
  console.log("CryptoReady waitning....");
  await cryptoWaitReady();

  const wsProvider = new WsProvider();
  const keyring = new Keyring({ type: "sr25519" });

  const alice = keyring.addFromUri("//Alice");

  // We have to add type when creating api instance
  // so we can `createType` later. See https://polkadot.js.org/docs/api/start/types.create/#how-to-create-types
  //    calleeContract.nativeContract.abi.registry.knownTypes
  const api = await ApiPromise.create({
    provider: wsProvider,
    types: {
      SecretStruct: {
        number: "u32",
        string: "String",
      },
    },
  });

  console.log("Uploading contracts code...");
  const callerCodeHash = await uploadCode(api, alice, new Abi(CallerAbi));
  const calleeCodeHash = await uploadCode(api, alice, new Abi(CalleeAbi));
  const tokenCodeHash = await uploadCode(api, alice, new Abi(TokenAbi));
  console.log(
    `Caller code hash: ${callerCodeHash}\nCallee code hash: ${calleeCodeHash}\nToken code hash: ${tokenCodeHash}`
  );
  console.log("Deploying contracts...");
  const callerConstractor = new CallerConstructors(api, alice);
  const calleeConstractor = new CalleeConstructors(api, alice);
  const tokenConstractor = new TokenConstructors(api, alice);
  const { address: callerAddress } = await callerConstractor.new();
  const { address: calleeAddress } = await calleeConstractor.new(
    "Initial secret phrase",
    {
      string: "Initial secret phrase inside struct",
      number: 2137,
    } as SecretStruct
  );
  console.log(
    `Contract adresses:\nCaller: ${callerAddress}\nCallee: ${calleeAddress}`
  );
  const { address: tokenAddress } = await tokenConstractor.new(1000);

  const callerContract = new CallerContract(callerAddress, alice, api);
  const calleeContract = new CalleeContract(calleeAddress, alice, api);
  const tokenContract = new TokenContract(tokenAddress, alice, api);

  // Finding the method/message selector
  const setSecretValueSelector = calleeContract.abi.findMessage(
    "set_string_and_struct"
  ).selector;

  let secretStringVal = (await calleeContract.query.getSecretString()).value.ok;
  let secretStructVal = (await calleeContract.query.getSecretStruct()).value.ok;
  console.log(`Secret string: ${JSON.stringify(secretStringVal)}`);
  console.log(`Secret struct: ${JSON.stringify(secretStructVal)}`);
  // Here, we create parameters which will be SCALE encoded
  // and join them respectively into one array of bytes
  const inputData = Array.from(
    api.createType("String", "New secret phrase").toU8a()
  ).concat(
    Array.from(
      api
        .createType("SecretStruct", {
          string: "New secret phrase inside struct",
          number: 42,
        } as SecretStruct)
        .toU8a()
    )
  );
  console.log("Making call...");
  await callerContract.tx.call({
    destination: calleeAddress,
    selector: setSecretValueSelector as any,
    input: inputData,
    allowReentry: true,
    transferredValue: 0,
    gasLimit: 0,
  } as Transaction);

  secretStringVal = (await calleeContract.query.getSecretString()).value.ok;
  secretStructVal = (await calleeContract.query.getSecretStruct()).value.ok;
  console.log(`Secret string: ${JSON.stringify(secretStringVal)}`);
  console.log(`Secret struct: ${JSON.stringify(secretStructVal)}`);

  await tokenContract.tx.transfer(callerAddress, 100, []);
  console.log("Before transactions:");
  console.log(
    `A PSP22 balance: ${(
      await tokenContract.query.balanceOf(callerAddress)
    ).value.ok.toNumber()}`
  );
  console.log(
    `B PSP22 balance: ${(
      await tokenContract.query.balanceOf(calleeAddress)
    ).value.ok.toNumber()}`
  );

  const transferSelector =
    tokenContract.abi.findMessage("psp22::transfer").selector;

  const inputDataForTransfer1 = Array.from(
    api.createType("AccountId", calleeAddress).toU8a()
  )
    .concat(Array.from(api.createType("u128", 42).toU8a()))
    .concat(Array.from(api.createType("Vec<u8>", []).toU8a()));

  const inputDataForTransfer2 = Array.from(
    api.createType("AccountId", calleeAddress).toU8a()
  )
    .concat(Array.from(api.createType("u128", 21).toU8a()))
    .concat(Array.from(api.createType("Vec<u8>", []).toU8a()));

  const transactions = [
    {
      destination: tokenAddress,
      selector: transferSelector as any,
      input: inputDataForTransfer1,
      allowReentry: true,
      transferredValue: 0,
      gasLimit: 0,
    } as Transaction,
    {
      destination: tokenAddress,
      selector: transferSelector as any,
      input: inputDataForTransfer2,
      allowReentry: true,
      transferredValue: 0,
      gasLimit: 0,
    } as Transaction,
  ];

  await callerContract.tx.saveTransactions(transactions);

  await callerContract.tx.executeTransactions();

  console.log("After transactions:");
  console.log(
    `A Balance: ${(
      await tokenContract.query.balanceOf(callerAddress)
    ).value.ok.toNumber()}`
  );
  console.log(
    `B Balance: ${(
      await tokenContract.query.balanceOf(calleeAddress)
    ).value.ok.toNumber()}`
  );

  console.log("Before transactions (transfer native):");
  await api.tx.balances.transfer(calleeAddress, 10000).signAndSend(alice);

  async function getBalance(account: string) {
    const querRes = await api.query.system.account(account);
    return (JSON.parse(JSON.stringify(querRes.toHuman()))).data.free
  }

  console.log(`A Balance: ${await getBalance(calleeAddress)}`);
  console.log(`B Balance: ${await getBalance(tokenAddress)}`);

  const withdrawSelector =
    calleeContract.abi.findMessage("withdraw_native").selector;

  const inputDataForTransferNative1 = Array.from(
    api.createType("AccountId", tokenAddress).toU8a()
  ).concat(Array.from(api.createType("u128", 2137).toU8a()));

  const inputDataForTransferNative2 = Array.from(
    api.createType("AccountId", tokenAddress).toU8a()
  ).concat(Array.from(api.createType("u128", 1234).toU8a()));

  await callerContract.tx.saveTransactions([
    {
      destination: calleeAddress,
      selector: withdrawSelector as any,
      input: inputDataForTransferNative1,
      allowReentry: true,
      transferredValue: 0,
      gasLimit: 0,
    } as Transaction,
    {
      destination: calleeAddress,
      selector: withdrawSelector as any,
      input: inputDataForTransferNative2,
      allowReentry: true,
      transferredValue: 0,
      gasLimit: 0,
    } as Transaction
  ]);

  await callerContract.tx.executeTransactions();

  console.log("After transactions (transfer native):");

  console.log(
    `A Balance: ${await getBalance(calleeAddress)}`
  );
  console.log(
    `B Balance: ${await getBalance(tokenAddress)}`
  );

  console.log("All done!");
  api.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
