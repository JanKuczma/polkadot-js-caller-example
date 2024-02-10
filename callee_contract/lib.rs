#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod callee_contract {

    use ink::prelude::string::String;

    #[derive(Debug, Clone, PartialEq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct SecretStruct {
        number: u32,
        string: String,
    }
    #[ink(storage)]
    pub struct CalleeContract {
        secret_string: String,
        secret_struct: SecretStruct,
    }

    impl CalleeContract {
        #[ink(constructor)]
        pub fn new(secret_string: String, secret_struct: SecretStruct) -> Self {
            Self {
                secret_string,
                secret_struct,
            }
        }

        #[ink(message)]
        pub fn set_string_and_struct(
            &mut self,
            secret_straing: String,
            secret_struct: SecretStruct,
        ) {
            self.secret_string = secret_straing;
            self.secret_struct = secret_struct;
        }

        #[ink(message)]
        pub fn get_secret_string(&self) -> String {
            self.secret_string.clone()
        }

        #[ink(message)]
        pub fn get_secret_struct(&self) -> SecretStruct {
            self.secret_struct.clone()
        }
    }
}
