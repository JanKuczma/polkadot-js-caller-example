compile_contracts:
	cd caller_contract && cargo contract build --release
	cd callee_contract && cargo contract build --release
	cd token && cargo contract build --release
generate-types: compile_contracts
	npx @727-ventures/typechain-polkadot --in target/ink/caller_contract --out types
	npx @727-ventures/typechain-polkadot --in target/ink/callee_contract --out types
	npx @727-ventures/typechain-polkadot --in target/ink/token --out types
run-chain:
	./scripts/substrate-contracts-node
deploy:
	npx ts-node scripts/deploy.ts