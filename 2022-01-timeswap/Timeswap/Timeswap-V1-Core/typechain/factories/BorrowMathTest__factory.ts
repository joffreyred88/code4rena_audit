/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BorrowMathTest,
  BorrowMathTestInterface,
} from "../BorrowMathTest";

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
        name: "xDecrease",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "yIncrease",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "zIncrease",
        type: "uint112",
      },
      {
        internalType: "uint16",
        name: "fee",
        type: "uint16",
      },
    ],
    name: "check",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
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
        name: "xDecrease",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "zIncrease",
        type: "uint112",
      },
    ],
    name: "getCollateral",
    outputs: [
      {
        internalType: "uint112",
        name: "collateralIn",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "uint112",
        name: "xDecrease",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "yIncrease",
        type: "uint112",
      },
    ],
    name: "getDebt",
    outputs: [
      {
        internalType: "uint112",
        name: "debtIn",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506108a0806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806302963a811461004657806356c3ae341461006e5780635d6f09ca14610099575b600080fd5b6100596100543660046105d9565b6100ac565b60405190151581526020015b60405180910390f35b61008161007c36600461069d565b6100c7565b6040516001600160701b039091168152602001610065565b6100816100a736600461064d565b6100dc565b60006100bb86868686866100f3565b50600195945050505050565b60006100d48484846101f7565b949350505050565b60006100ea85858585610246565b95945050505050565b600061010661ffff8316620100006107dc565b62ffffff169050600085876080015161011f91906107b4565b905060006101328860a0015187856102e4565b905060006101458960c0015187866102e4565b905061015389848484610318565b60a08901516001600160701b03808a169161016f911682610795565b600c1b90506001600160701b0384166101916001600160801b03871682610795565b905061019d8282610414565b915081896001600160701b031610156101ea5760405162461bcd60e51b81526004016101e1906020808252600490820152632299981960e11b604082015260600190565b60405180910390fd5b5050505050505050505050565b60008361020442826107f8565b90506102196001600160701b03841682610795565b9050610226816020610448565b905061023b6001600160701b0385168261073a565b90506100ea81610463565b60008461025342826107f8565b90506102686001600160701b03841682610795565b9050610275816019610448565b60c08601519091506001600160701b039081169061029590861682610795565b60808701519091506001600160701b03908116906102b5908716826107f8565b90506102c18282610414565b91506102cd828461073a565b92506102d883610463565b98975050505050505050565b6fffffffffffffffffffffffffffff0000601084901b1661030e6001600160701b03841683610766565b6100d4908261070f565b6000806103446001600160701b03861661033e6001600160801b03808716908816610795565b9061047e565b9150915060008061038c88608001516001600160701b031660208a60c001516001600160701b03168b60a001516001600160701b03166103849190610795565b901b9061047e565b91509150808310156103c95760405162461bcd60e51b81526004016101e1906020808252600490820152634533303160e01b604082015260600190565b8083141561040a578184101561040a5760405162461bcd60e51b81526004016101e1906020808252600490820152634533303160e01b604082015260600190565b5050505050505050565b60006104208284610752565b9050600061042e838561082a565b1115610442578061043e8161080f565b9150505b92915050565b60ff811682811c9081901b8314610442578061043e8161080f565b806001600160701b038116811461047957600080fd5b919050565b6000806000198385098385029250828110838203039150509250929050565b6000604082840312156104ae578081fd5b6040516040810181811067ffffffffffffffff821117156104dd57634e487b7160e01b83526041600452602483fd5b6040529050806104ec836105c2565b81526104fa602084016105c2565b60208201525092915050565b60006101208284031215610518578081fd5b6105206106d8565b905061052c838361049d565b815260408201356020820152610545836060840161049d565b604082015260a08201356effffffffffffffffffffffffffffff8116811461056c57600080fd5b606082015261057d60c083016105ab565b608082015261058e60e083016105ab565b60a08201526105a061010083016105ab565b60c082015292915050565b80356001600160701b038116811461047957600080fd5b80356001600160801b038116811461047957600080fd5b60008060008060006101a086880312156105f1578081fd5b6105fb8787610506565b945061060a61012087016105ab565b935061061961014087016105ab565b925061062861016087016105ab565b915061018086013561ffff8116811461063f578182fd5b809150509295509295909350565b6000806000806101808587031215610663578384fd5b843593506106748660208701610506565b925061068361014086016105ab565b915061069261016086016105ab565b905092959194509250565b6000806000606084860312156106b1578283fd5b833592506106c1602085016105ab565b91506106cf604085016105ab565b90509250925092565b60405160e0810167ffffffffffffffff8111828210171561070957634e487b7160e01b600052604160045260246000fd5b60405290565b60006001600160801b038083168185168083038211156107315761073161083e565b01949350505050565b6000821982111561074d5761074d61083e565b500190565b60008261076157610761610854565b500490565b60006001600160801b038083168185168183048111821515161561078c5761078c61083e565b02949350505050565b60008160001904831182151516156107af576107af61083e565b500290565b60006001600160701b03838116908316818110156107d4576107d461083e565b039392505050565b600062ffffff838116908316818110156107d4576107d461083e565b60008282101561080a5761080a61083e565b500390565b60006000198214156108235761082361083e565b5060010190565b60008261083957610839610854565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fdfea264697066735822122027c1e616ba4f2c25a403596d4f1fc890b4bb9fde55e1f84f00ed66c3a365a9ae64736f6c63430008040033";

export class BorrowMathTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BorrowMathTest> {
    return super.deploy(overrides || {}) as Promise<BorrowMathTest>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BorrowMathTest {
    return super.attach(address) as BorrowMathTest;
  }
  connect(signer: Signer): BorrowMathTest__factory {
    return super.connect(signer) as BorrowMathTest__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BorrowMathTestInterface {
    return new utils.Interface(_abi) as BorrowMathTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BorrowMathTest {
    return new Contract(address, _abi, signerOrProvider) as BorrowMathTest;
  }
}
