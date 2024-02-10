import { ApiPromise } from "@polkadot/api";
import { Abi, ContractPromise } from "@polkadot/api-contract";
import { AbiMessage } from "@polkadot/api-contract/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { HexString } from "@polkadot/util/types";

export async function uploadCode(
    api: ApiPromise,
    deployer: KeyringPair,
    contractAbi: Abi
  ): Promise<HexString> {
    await new Promise(async (resolve, reject) => {
      const unsub = await api.tx.contracts
        .uploadCode(contractAbi.info.source.wasm, null, 0)
        .signAndSend(deployer, (result) => {
          if (result.isInBlock) {
            unsub();
            resolve(result.txHash);
          }
          if (result.isError) {
            unsub();
            reject(result);
          }
        });
    });
    return contractAbi.info.source.wasmHash.toHex();
  }