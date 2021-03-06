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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface BorrowMathTestInterface extends ethers.utils.Interface {
  functions: {
    "check(tuple,uint112,uint112,uint112,uint16)": FunctionFragment;
    "getCollateral(uint256,tuple,uint112,uint112)": FunctionFragment;
    "getDebt(uint256,uint112,uint112)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "check",
    values: [
      {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getCollateral",
    values: [
      BigNumberish,
      {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getDebt",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "check", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getDebt", data: BytesLike): Result;

  events: {};
}

export class BorrowMathTest extends BaseContract {
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

  interface: BorrowMathTestInterface;

  functions: {
    check(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "check(((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112,uint112,uint16)"(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getCollateral(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { collateralIn: BigNumber }>;

    "getCollateral(uint256,((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112)"(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { collateralIn: BigNumber }>;

    getDebt(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { debtIn: BigNumber }>;

    "getDebt(uint256,uint112,uint112)"(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { debtIn: BigNumber }>;
  };

  check(
    state: {
      reserves: { asset: BigNumberish; collateral: BigNumberish };
      totalLiquidity: BigNumberish;
      totalClaims: { bond: BigNumberish; insurance: BigNumberish };
      totalDebtCreated: BigNumberish;
      x: BigNumberish;
      y: BigNumberish;
      z: BigNumberish;
    },
    xDecrease: BigNumberish,
    yIncrease: BigNumberish,
    zIncrease: BigNumberish,
    fee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "check(((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112,uint112,uint16)"(
    state: {
      reserves: { asset: BigNumberish; collateral: BigNumberish };
      totalLiquidity: BigNumberish;
      totalClaims: { bond: BigNumberish; insurance: BigNumberish };
      totalDebtCreated: BigNumberish;
      x: BigNumberish;
      y: BigNumberish;
      z: BigNumberish;
    },
    xDecrease: BigNumberish,
    yIncrease: BigNumberish,
    zIncrease: BigNumberish,
    fee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getCollateral(
    maturity: BigNumberish,
    state: {
      reserves: { asset: BigNumberish; collateral: BigNumberish };
      totalLiquidity: BigNumberish;
      totalClaims: { bond: BigNumberish; insurance: BigNumberish };
      totalDebtCreated: BigNumberish;
      x: BigNumberish;
      y: BigNumberish;
      z: BigNumberish;
    },
    xDecrease: BigNumberish,
    zIncrease: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getCollateral(uint256,((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112)"(
    maturity: BigNumberish,
    state: {
      reserves: { asset: BigNumberish; collateral: BigNumberish };
      totalLiquidity: BigNumberish;
      totalClaims: { bond: BigNumberish; insurance: BigNumberish };
      totalDebtCreated: BigNumberish;
      x: BigNumberish;
      y: BigNumberish;
      z: BigNumberish;
    },
    xDecrease: BigNumberish,
    zIncrease: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDebt(
    maturity: BigNumberish,
    xDecrease: BigNumberish,
    yIncrease: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getDebt(uint256,uint112,uint112)"(
    maturity: BigNumberish,
    xDecrease: BigNumberish,
    yIncrease: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    check(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "check(((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112,uint112,uint16)"(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getCollateral(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCollateral(uint256,((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112)"(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDebt(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getDebt(uint256,uint112,uint112)"(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    check(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "check(((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112,uint112,uint16)"(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getCollateral(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCollateral(uint256,((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112)"(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDebt(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getDebt(uint256,uint112,uint112)"(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    check(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "check(((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112,uint112,uint16)"(
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      zIncrease: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCollateral(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getCollateral(uint256,((uint128,uint128),uint256,(uint128,uint128),uint120,uint112,uint112,uint112),uint112,uint112)"(
      maturity: BigNumberish,
      state: {
        reserves: { asset: BigNumberish; collateral: BigNumberish };
        totalLiquidity: BigNumberish;
        totalClaims: { bond: BigNumberish; insurance: BigNumberish };
        totalDebtCreated: BigNumberish;
        x: BigNumberish;
        y: BigNumberish;
        z: BigNumberish;
      },
      xDecrease: BigNumberish,
      zIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDebt(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getDebt(uint256,uint112,uint112)"(
      maturity: BigNumberish,
      xDecrease: BigNumberish,
      yIncrease: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
