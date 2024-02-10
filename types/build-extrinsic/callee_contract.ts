/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types';
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/callee_contract';
import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';



export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		apiPromise: ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__apiPromise = apiPromise;
	}
	/**
	 * setStringAndStruct
	 *
	 * @param { string } secretStraing,
	 * @param { ArgumentTypes.SecretStruct } secretStruct,
	*/
	"setStringAndStruct" (
		secretStraing: string,
		secretStruct: ArgumentTypes.SecretStruct,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "setStringAndStruct", [secretStraing, secretStruct], __options);
	}

	/**
	 * getSecretString
	 *
	*/
	"getSecretString" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getSecretString", [], __options);
	}

	/**
	 * getSecretStruct
	 *
	*/
	"getSecretStruct" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "getSecretStruct", [], __options);
	}

}