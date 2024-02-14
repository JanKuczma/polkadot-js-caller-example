import type BN from 'bn.js';

export type SecretStruct = {
	number: (number | string | BN),
	string: string
}

export enum LangError {
	couldNotReadInput = 'CouldNotReadInput'
}

export type AccountId = string | number[]

