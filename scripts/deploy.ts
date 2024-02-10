import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { stringToU8a, u8aToHex } from "@polkadot/util";
import CallerConstructors from "../types/constructors/caller_contract";
import CallerContract from "../types/contracts/caller_contract";
import CalleeContract from "../types/contracts/callee_contract";
import CalleeConstructors from "../types/constructors/callee_contract";
import { Transaction } from "../types/types-arguments/caller_contract";
import { Abi } from "@polkadot/api-contract";
import { KeyringPair } from "@polkadot/keyring/types";
import { HexString } from "@polkadot/util/types";
import { ContractFile as CalleeAbi } from "../types/contract-info/caller_contract";
import { ContractFile as CallerAbi } from "../types/contract-info/caller_contract";
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
  console.log(
    `Caller code hash: ${callerCodeHash}\nCallee code hash: ${calleeCodeHash}`
  );
  console.log("Deploying contracts...");
  const callerContractor = new CallerConstructors(api, alice);
  const calleeContractor = new CalleeConstructors(api, alice);
  const { address: callerAddress } = await callerContractor.new();
  const { address: calleeAddress } = await calleeContractor.new(
    "Initial secret phrase",
    {
      string: "Initial secret phrase inside struct",
      number: 2137,
    } as SecretStruct
  );
  console.log(
    `Contract adresses:\nCaller: ${callerAddress}\nCallee: ${calleeAddress}`
  );
  const callerContract = new CallerContract(callerAddress, alice, api);
  const calleeContract = new CalleeContract(calleeAddress, alice, api);

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

  console.log("All done!");
  api.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
