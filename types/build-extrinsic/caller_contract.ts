/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types';
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/caller_contract';
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
	 * call
	 *
	 * @param { ArgumentTypes.Transaction } transaction,
	*/
	"call" (
		transaction: ArgumentTypes.Transaction,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "call", [transaction], __options);
	}

	/**
	 * saveTransactions
	 *
	 * @param { Array<ArgumentTypes.Transaction> } transactions,
	*/
	"saveTransactions" (
		transactions: Array<ArgumentTypes.Transaction>,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "saveTransactions", [transactions], __options);
	}

	/**
	 * executeTransactions
	 *
	*/
	"executeTransactions" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "executeTransactions", [], __options);
	}

}