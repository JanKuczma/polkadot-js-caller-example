#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod caller_contract {
    use ink::{
        env::{
            call::{build_call, ExecutionInput},
            CallFlags,
        },
        prelude::vec::Vec,
    };
    use scale::Output;

    pub struct CallInput<'a>(pub &'a [u8]);

    impl<'a> scale::Encode for CallInput<'a> {
        fn encode_to<T: Output + ?Sized>(&self, dest: &mut T) {
            dest.write(self.0);
        }
    }

    #[derive(Debug, Clone, PartialEq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Transaction {
        /// The `AccountId` of the contract that is called in this transaction.
        pub destination: AccountId,
        /// The selector bytes that identifies the function of the callee that should be called.
        pub selector: [u8; 4],
        /// The SCALE encoded parameters that are passed to the called function.
        pub input: Vec<u8>,
        /// Should allow reentrant call
        pub allow_reentry: bool,
        /// The amount of chain balance that is transferred to the callee.
        pub transferred_value: u128,
        /// Gas limit for the execution of the call.
        pub gas_limit: u64,
    }

    #[ink(storage)]
    pub struct CallerContract {
        transactions: Vec<Transaction>,
    }

    impl CallerContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                transactions: Vec::new(),
            }
        }

        #[ink(message)]
        pub fn call(&self, transaction: Transaction) -> Option<Vec<u8>> {
            match build_call::<<Self as ::ink::env::ContractEnv>::Env>()
                .call(transaction.destination)
                .call_flags(CallFlags::default().set_allow_reentry(transaction.allow_reentry))
                .exec_input(
                    ExecutionInput::new(ink::env::call::Selector::new(transaction.selector))
                        .push_arg(CallInput(&transaction.input)),
                )
                .returns::<Vec<u8>>()
                .try_invoke()
            {
                Ok(Ok(res)) => Some(res),
                _ => None,
            }
        }

        #[ink(message)]
        pub fn save_transactions(&mut self, transactions: Vec<Transaction>) {
            self.transactions = transactions;
        }

        #[ink(message)]
        pub fn execute_transactions(&mut self) {
            for transaction in self.transactions.clone() {
                self.call(transaction);
            }
        }
    }
}
