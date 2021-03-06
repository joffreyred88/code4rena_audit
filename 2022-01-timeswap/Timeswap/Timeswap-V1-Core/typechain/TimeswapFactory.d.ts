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

interface TimeswapFactoryInterface extends ethers.utils.Interface {
  functions: {
    "acceptOwner()": FunctionFragment;
    "createPair(address,address)": FunctionFragment;
    "fee()": FunctionFragment;
    "getPair(address,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "pendingOwner()": FunctionFragment;
    "protocolFee()": FunctionFragment;
    "setOwner(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "acceptOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createPair",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "fee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getPair",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "protocolFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "acceptOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "protocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;

  events: {
    "AcceptOwner(address)": EventFragment;
    "CreatePair(address,address,address)": EventFragment;
    "SetOwner(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AcceptOwner"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreatePair"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetOwner"): EventFragment;
}

export type AcceptOwnerEvent = TypedEvent<[string] & { owner: string }>;

export type CreatePairEvent = TypedEvent<
  [string, string, string] & { asset: string; collateral: string; pair: string }
>;

export type SetOwnerEvent = TypedEvent<[string] & { pendingOwner: string }>;

export class TimeswapFactory extends BaseContract {
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

  interface: TimeswapFactoryInterface;

  functions: {
    acceptOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "acceptOwner()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createPair(
      asset: string,
      collateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "createPair(address,address)"(
      asset: string,
      collateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fee(overrides?: CallOverrides): Promise<[number]>;

    "fee()"(overrides?: CallOverrides): Promise<[number]>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    pendingOwner(overrides?: CallOverrides): Promise<[string]>;

    "pendingOwner()"(overrides?: CallOverrides): Promise<[string]>;

    protocolFee(overrides?: CallOverrides): Promise<[number]>;

    "protocolFee()"(overrides?: CallOverrides): Promise<[number]>;

    setOwner(
      _pendingOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setOwner(address)"(
      _pendingOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  acceptOwner(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "acceptOwner()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createPair(
    asset: string,
    collateral: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "createPair(address,address)"(
    asset: string,
    collateral: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fee(overrides?: CallOverrides): Promise<number>;

  "fee()"(overrides?: CallOverrides): Promise<number>;

  getPair(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<string>;

  "getPair(address,address)"(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  pendingOwner(overrides?: CallOverrides): Promise<string>;

  "pendingOwner()"(overrides?: CallOverrides): Promise<string>;

  protocolFee(overrides?: CallOverrides): Promise<number>;

  "protocolFee()"(overrides?: CallOverrides): Promise<number>;

  setOwner(
    _pendingOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setOwner(address)"(
    _pendingOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptOwner(overrides?: CallOverrides): Promise<void>;

    "acceptOwner()"(overrides?: CallOverrides): Promise<void>;

    createPair(
      asset: string,
      collateral: string,
      overrides?: CallOverrides
    ): Promise<string>;

    "createPair(address,address)"(
      asset: string,
      collateral: string,
      overrides?: CallOverrides
    ): Promise<string>;

    fee(overrides?: CallOverrides): Promise<number>;

    "fee()"(overrides?: CallOverrides): Promise<number>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<string>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    pendingOwner(overrides?: CallOverrides): Promise<string>;

    "pendingOwner()"(overrides?: CallOverrides): Promise<string>;

    protocolFee(overrides?: CallOverrides): Promise<number>;

    "protocolFee()"(overrides?: CallOverrides): Promise<number>;

    setOwner(_pendingOwner: string, overrides?: CallOverrides): Promise<void>;

    "setOwner(address)"(
      _pendingOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AcceptOwner(address)"(
      owner?: string | null
    ): TypedEventFilter<[string], { owner: string }>;

    AcceptOwner(
      owner?: string | null
    ): TypedEventFilter<[string], { owner: string }>;

    "CreatePair(address,address,address)"(
      asset?: string | null,
      collateral?: string | null,
      pair?: null
    ): TypedEventFilter<
      [string, string, string],
      { asset: string; collateral: string; pair: string }
    >;

    CreatePair(
      asset?: string | null,
      collateral?: string | null,
      pair?: null
    ): TypedEventFilter<
      [string, string, string],
      { asset: string; collateral: string; pair: string }
    >;

    "SetOwner(address)"(
      pendingOwner?: string | null
    ): TypedEventFilter<[string], { pendingOwner: string }>;

    SetOwner(
      pendingOwner?: string | null
    ): TypedEventFilter<[string], { pendingOwner: string }>;
  };

  estimateGas: {
    acceptOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "acceptOwner()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createPair(
      asset: string,
      collateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "createPair(address,address)"(
      asset: string,
      collateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    "fee()"(overrides?: CallOverrides): Promise<BigNumber>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    pendingOwner(overrides?: CallOverrides): Promise<BigNumber>;

    "pendingOwner()"(overrides?: CallOverrides): Promise<BigNumber>;

    protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

    "protocolFee()"(overrides?: CallOverrides): Promise<BigNumber>;

    setOwner(
      _pendingOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setOwner(address)"(
      _pendingOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "acceptOwner()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createPair(
      asset: string,
      collateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "createPair(address,address)"(
      asset: string,
      collateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "fee()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPair(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getPair(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "pendingOwner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    protocolFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "protocolFee()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setOwner(
      _pendingOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setOwner(address)"(
      _pendingOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
