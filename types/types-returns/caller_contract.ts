import type BN from 'bn.js';
import type {ReturnNumber} from '@727-ventures/typechain-types';

export type Transaction = {
	destination: AccountId,
	selector: Array<number>,
	input: Array<number>,
	allowReentry: boolean,
	transferredValue: ReturnNumber,
	gasLimit: number
}

export type AccountId = string | number[]

export enum LangError {
	couldNotReadInput = 'CouldNotReadInput'
}

