/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BlockNumberTest,
  BlockNumberTestInterface,
} from "../BlockNumberTest";

const _abi = [
  {
    inputs: [],
    name: "get",
    outputs: [
      {
        internalType: "uint32",
        name: "blockNumber",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60d3610039600b82828239805160001a60731461002c57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c80636d4ce63c146038575b600080fd5b603e6057565b60405163ffffffff909116815260200160405180910390f35b6000605f6064565b905090565b6000605f436000607864010000000083607e565b92915050565b600082609857634e487b7160e01b81526012600452602481fd5b50069056fea2646970667358221220a2d89d1d0a0bd25802267932b5567162292dc54e794c0d1e2e0cf4571fb1589f64736f6c63430008040033";

export class BlockNumberTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BlockNumberTest> {
    return super.deploy(overrides || {}) as Promise<BlockNumberTest>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BlockNumberTest {
    return super.attach(address) as BlockNumberTest;
  }
  connect(signer: Signer): BlockNumberTest__factory {
    return super.connect(signer) as BlockNumberTest__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BlockNumberTestInterface {
    return new utils.Interface(_abi) as BlockNumberTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BlockNumberTest {
    return new Contract(address, _abi, signerOrProvider) as BlockNumberTest;
  }
}
