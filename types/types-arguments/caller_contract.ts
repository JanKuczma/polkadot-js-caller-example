import type BN from 'bn.js';

export type Transaction = {
	destination: AccountId,
	selector: Array<(number | string | BN)>,
	input: Array<(number | string | BN)>,
	allowReentry: boolean,
	transferredValue: (string | number | BN),
	gasLimit: (number | string | BN)
}

export type AccountId = string | number[]

export enum LangError {
	couldNotReadInput = 'CouldNotReadInput'
}

