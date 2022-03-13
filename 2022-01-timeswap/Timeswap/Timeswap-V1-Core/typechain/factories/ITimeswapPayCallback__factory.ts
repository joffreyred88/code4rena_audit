/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ITimeswapPayCallback,
  ITimeswapPayCallbackInterface,
} from "../ITimeswapPayCallback";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint128",
        name: "assetIn",
        type: "uint128",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "timeswapPayCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ITimeswapPayCallback__factory {
  static readonly abi = _abi;
  static createInterface(): ITimeswapPayCallbackInterface {
    return new utils.Interface(_abi) as ITimeswapPayCallbackInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITimeswapPayCallback {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ITimeswapPayCallback;
  }
}
