/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ConstantProductTest,
  ConstantProductTestInterface,
} from "../ConstantProductTest";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint128",
                name: "asset",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "collateral",
                type: "uint128",
              },
            ],
            internalType: "struct IPair.Tokens",
            name: "reserves",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "totalLiquidity",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint128",
                name: "bond",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "insurance",
                type: "uint128",
              },
            ],
            internalType: "struct IPair.Claims",
            name: "totalClaims",
            type: "tuple",
          },
          {
            internalType: "uint120",
            name: "totalDebtCreated",
            type: "uint120",
          },
          {
            internalType: "uint112",
            name: "x",
            type: "uint112",
          },
          {
            internalType: "uint112",
            name: "y",
            type: "uint112",
          },
          {
            internalType: "uint112",
            name: "z",
            type: "uint112",
          },
        ],
        internalType: "struct IPair.State",
        name: "state",
        type: "tuple",
      },
      {
        internalType: "uint112",
        name: "xReserve",
        type: "uint112",
      },
      {
        internalType: "uint128",
        name: "yAdjusted",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "zAdjusted",
        type: "uint128",
      },
    ],
    name: "checkConstantProduct",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506103bd806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063a764012414610030575b600080fd5b61004361003e36600461024f565b610057565b604051901515815260200160405180910390f35b600061006585858585610070565b506001949350505050565b60008061009c6001600160701b0386166100966001600160801b0380871690881661035c565b90610175565b915091506000806100e488608001516001600160701b031660208a60c001516001600160701b03168b60a001516001600160701b03166100dc919061035c565b901b90610175565b915091508083101561012a5760405162461bcd60e51b8152600401610121906020808252600490820152634533303160e01b604082015260600190565b60405180910390fd5b8083141561016b578184101561016b5760405162461bcd60e51b8152600401610121906020808252600490820152634533303160e01b604082015260600190565b5050505050505050565b6000806000198385098385029250828110838203039150509250929050565b6000604082840312156101a5578081fd5b6040516040810181811067ffffffffffffffff821117156101d457634e487b7160e01b83526041600452602483fd5b6040529050806101e383610238565b81526101f160208401610238565b60208201525092915050565b80356001600160701b038116811461021457600080fd5b919050565b80356effffffffffffffffffffffffffffff8116811461021457600080fd5b80356001600160801b038116811461021457600080fd5b600080600080848603610180811215610266578485fd5b61012080821215610275578586fd5b61027d610325565b91506102898888610194565b8252604087013560208301526102a28860608901610194565b60408301526102b360a08801610219565b60608301526102c460c088016101fd565b60808301526102d560e088016101fd565b60a08301526102e761010088016101fd565b60c08301528195506102fa8188016101fd565b9450505061030b6101408601610238565b915061031a6101608601610238565b905092959194509250565b60405160e0810167ffffffffffffffff8111828210171561035657634e487b7160e01b600052604160045260246000fd5b60405290565b600081600019048311821515161561038257634e487b7160e01b81526011600452602481fd5b50029056fea264697066735822122061cd34e479e3ea27315f0c4f65b216bac0cfd61bc7066742a31e9607acee402364736f6c63430008040033";

export class ConstantProductTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ConstantProductTest> {
    return super.deploy(overrides || {}) as Promise<ConstantProductTest>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ConstantProductTest {
    return super.attach(address) as ConstantProductTest;
  }
  connect(signer: Signer): ConstantProductTest__factory {
    return super.connect(signer) as ConstantProductTest__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ConstantProductTestInterface {
    return new utils.Interface(_abi) as ConstantProductTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ConstantProductTest {
    return new Contract(address, _abi, signerOrProvider) as ConstantProductTest;
  }
}