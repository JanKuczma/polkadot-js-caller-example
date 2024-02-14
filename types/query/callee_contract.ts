/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryJSON, queryOkJSON, handleReturnType } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/callee_contract';
import type * as ReturnTypes from '../types-returns/callee_contract';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
import DATA_TYPE_DESCRIPTIONS from '../data/callee_contract.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;
	readonly __callerAddress : string;

	constructor(
		nativeContract : ContractPromise,
		nativeApi : ApiPromise,
		callerAddress : string,
	) {
		this.__nativeContract = nativeContract;
		this.__callerAddress = callerAddress;
		this.__apiPromise = nativeApi;
	}

	/**
	* setStringAndStruct
	*
	* @param { string } secretStraing,
	* @param { ArgumentTypes.SecretStruct } secretStruct,
	* @returns { Result<null, ReturnTypes.LangError> }
	*/
	"setStringAndStruct" (
		secretStraing: string,
		secretStruct: ArgumentTypes.SecretStruct,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "setStringAndStruct", [secretStraing, secretStruct], __options , (result) => { return handleReturnType(result, getTypeDescription(3, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getSecretString
	*
	* @returns { Result<string, ReturnTypes.LangError> }
	*/
	"getSecretString" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<string, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "getSecretString", [], __options , (result) => { return handleReturnType(result, getTypeDescription(6, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getSecretStruct
	*
	* @returns { Result<ReturnTypes.SecretStruct, ReturnTypes.LangError> }
	*/
	"getSecretStruct" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.SecretStruct, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "getSecretStruct", [], __options , (result) => { return handleReturnType(result, getTypeDescription(7, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* withdrawNative
	*
	* @param { ArgumentTypes.AccountId } to,
	* @param { (string | number | BN) } amount,
	* @returns { Result<boolean, ReturnTypes.LangError> }
	*/
	"withdrawNative" (
		to: ArgumentTypes.AccountId,
		amount: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<boolean, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "withdrawNative", [to, amount], __options , (result) => { return handleReturnType(result, getTypeDescription(12, DATA_TYPE_DESCRIPTIONS)); });
	}

}