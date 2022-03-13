import { BigNumber } from "ethers";

export const ADDRESSES: {
  [chainId: number]: {
    [contract: string]: string;
  };
} = {
  137: {
    voteTracker: "0x63368f34B84C697d9f629F33B5CAdc22cb00510E",
    multicall: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
  },
};

export const MAX_FEE = BigNumber.from("10000");
