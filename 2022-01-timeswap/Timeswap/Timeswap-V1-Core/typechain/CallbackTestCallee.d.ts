/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface CallbackTestCalleeInterface extends ethers.utils.Interface {
  functions: {
    "borrow(address,uint112,bytes)": FunctionFragment;
    "callbackTestContract()": FunctionFragment;
    "lend(address,uint112,bytes)": FunctionFragment;
    "mint(address,address,uint112,uint112,bytes)": FunctionFragment;
    "pay(address,uint128,bytes)": FunctionFragment;
    "timeswapBorrowCallback(uint112,bytes)": FunctionFragment;
    "timeswapLendCallback(uint112,bytes)": FunctionFragment;
    "timeswapMintCallback(uint112,uint112,bytes)": FunctionFragment;
    "timeswapPayCallback(uint128,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "borrow",
    values: [string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "callbackTestContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lend",
    values: [string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "pay",
    values: [string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "timeswapBorrowCallback",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "timeswapLendCallback",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "timeswapMintCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "timeswapPayCallback",
    values: [BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "borrow", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "callbackTestContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lend", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pay", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "timeswapBorrowCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "timeswapLendCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "timeswapMintCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "timeswapPayCallback",
    data: BytesLike
  ): Result;

  events: {};
}

export class CallbackTestCallee extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: CallbackTestCalleeInterface;

  functions: {
    borrow(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "borrow(address,uint112,bytes)"(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    callbackTestContract(overrides?: CallOverrides): Promise<[string]>;

    "callbackTestContract()"(overrides?: CallOverrides): Promise<[string]>;

    lend(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "lend(address,uint112,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mint(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "mint(address,address,uint112,uint112,bytes)"(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    pay(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "pay(address,uint128,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    timeswapBorrowCallback(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "timeswapBorrowCallback(uint112,bytes)"(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    timeswapLendCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "timeswapLendCallback(uint112,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    timeswapMintCallback(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "timeswapMintCallback(uint112,uint112,bytes)"(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    timeswapPayCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "timeswapPayCallback(uint128,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  borrow(
    collateral: string,
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "borrow(address,uint112,bytes)"(
    collateral: string,
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callbackTestContract(overrides?: CallOverrides): Promise<string>;

  "callbackTestContract()"(overrides?: CallOverrides): Promise<string>;

  lend(
    asset: string,
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "lend(address,uint112,bytes)"(
    asset: string,
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mint(
    asset: string,
    collateral: string,
    assetIn: BigNumberish,
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "mint(address,address,uint112,uint112,bytes)"(
    asset: string,
    collateral: string,
    assetIn: BigNumberish,
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  pay(
    asset: string,
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "pay(address,uint128,bytes)"(
    asset: string,
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  timeswapBorrowCallback(
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "timeswapBorrowCallback(uint112,bytes)"(
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  timeswapLendCallback(
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "timeswapLendCallback(uint112,bytes)"(
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  timeswapMintCallback(
    assetIn: BigNumberish,
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "timeswapMintCallback(uint112,uint112,bytes)"(
    assetIn: BigNumberish,
    collateralIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  timeswapPayCallback(
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "timeswapPayCallback(uint128,bytes)"(
    assetIn: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    borrow(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "borrow(address,uint112,bytes)"(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    callbackTestContract(overrides?: CallOverrides): Promise<string>;

    "callbackTestContract()"(overrides?: CallOverrides): Promise<string>;

    lend(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "lend(address,uint112,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    mint(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "mint(address,address,uint112,uint112,bytes)"(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    pay(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "pay(address,uint128,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    timeswapBorrowCallback(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "timeswapBorrowCallback(uint112,bytes)"(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    timeswapLendCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "timeswapLendCallback(uint112,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    timeswapMintCallback(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "timeswapMintCallback(uint112,uint112,bytes)"(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    timeswapPayCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "timeswapPayCallback(uint128,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    borrow(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "borrow(address,uint112,bytes)"(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    callbackTestContract(overrides?: CallOverrides): Promise<BigNumber>;

    "callbackTestContract()"(overrides?: CallOverrides): Promise<BigNumber>;

    lend(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "lend(address,uint112,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mint(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "mint(address,address,uint112,uint112,bytes)"(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    pay(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "pay(address,uint128,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    timeswapBorrowCallback(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "timeswapBorrowCallback(uint112,bytes)"(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    timeswapLendCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "timeswapLendCallback(uint112,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    timeswapMintCallback(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "timeswapMintCallback(uint112,uint112,bytes)"(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    timeswapPayCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "timeswapPayCallback(uint128,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    borrow(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "borrow(address,uint112,bytes)"(
      collateral: string,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    callbackTestContract(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "callbackTestContract()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lend(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "lend(address,uint112,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mint(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "mint(address,address,uint112,uint112,bytes)"(
      asset: string,
      collateral: string,
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    pay(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "pay(address,uint128,bytes)"(
      asset: string,
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    timeswapBorrowCallback(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "timeswapBorrowCallback(uint112,bytes)"(
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    timeswapLendCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "timeswapLendCallback(uint112,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    timeswapMintCallback(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "timeswapMintCallback(uint112,uint112,bytes)"(
      assetIn: BigNumberish,
      collateralIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    timeswapPayCallback(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "timeswapPayCallback(uint128,bytes)"(
      assetIn: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}