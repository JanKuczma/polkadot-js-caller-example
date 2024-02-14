/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryOkJSON, queryJSON, handleReturnType } from '@727-ventures/typechain-types';
import { txSignAndSend } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/callee_contract';
import type * as ReturnTypes from '../types-returns/callee_contract';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
// @ts-ignore
import type {EventRecord} from "@polkadot/api/submittable";
import {decodeEvents} from "../shared/utils";
import DATA_TYPE_DESCRIPTIONS from '../data/callee_contract.json';
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/callee_contract.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __keyringPair : KeyringPair;
	readonly __callerAddress : string;
	readonly __apiPromise: ApiPromise;

	constructor(
		apiPromise : ApiPromise,
		nativeContract : ContractPromise,
		keyringPair : KeyringPair,
	) {
		this.__apiPromise = apiPromise;
		this.__nativeContract = nativeContract;
		this.__keyringPair = keyringPair;
		this.__callerAddress = keyringPair.address;
	}

	/**
	* setStringAndStruct
	*
	* @param { string } secretStraing,
	* @param { ArgumentTypes.SecretStruct } secretStruct,
	* @returns { void }
	*/
	"setStringAndStruct" (
		secretStraing: string,
		secretStruct: ArgumentTypes.SecretStruct,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "setStringAndStruct", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [secretStraing, secretStruct], __options);
	}

	/**
	* getSecretString
	*
	* @returns { Result<string, ReturnTypes.LangError> }
	*/
	"getSecretString" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<string, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "getSecretString", [], __options, (result) => { return handleReturnType(result, getTypeDescription(6, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getSecretStruct
	*
	* @returns { Result<ReturnTypes.SecretStruct, ReturnTypes.LangError> }
	*/
	"getSecretStruct" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.SecretStruct, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "getSecretStruct", [], __options, (result) => { return handleReturnType(result, getTypeDescription(7, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* withdrawNative
	*
	* @param { ArgumentTypes.AccountId } to,
	* @param { (string | number | BN) } amount,
	* @returns { void }
	*/
	"withdrawNative" (
		to: ArgumentTypes.AccountId,
		amount: (string | number | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "withdrawNative", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [to, amount], __options);
	}

}