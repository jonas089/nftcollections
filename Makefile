prepare:
	rustup target add wasm32-unknown-unknown

build-contract:
	cd contract && cargo build --release --target wasm32-unknown-unknown
	wasm-strip contract/src/contract.wasm 2>/dev/null | true
