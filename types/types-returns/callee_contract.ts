import type BN from 'bn.js';
import type {ReturnNumber} from '@727-ventures/typechain-types';

export type SecretStruct = {
	number: number,
	string: string
}

export enum LangError {
	couldNotReadInput = 'CouldNotReadInput'
}

export type AccountId = string | number[]

