import { BigNumber } from "ethers";

export interface UserVotes {
  totalVotes: string;
  allocations: { reactorKey: string; amount: string }[];
}

export interface UserVotesList {
  [address: string]: UserVotes;
}

export interface UserClaims {
  [token: string]: {
    index: number;
    amount: string;
    proof: string[];
  };
}

export interface UserClaimsList {
  [address: string]: UserClaims;
}

export interface TokenDistribution {
  [token: string]: { [address: string]: string };
}

export interface ReactorVotes {
  [reactorKey: string]: BigNumber;
}

export interface TokenToReactorKey {
  [token: string]: string;
}

export interface Bribes {
  [token: string]: { [reactorKey: string]: BigNumber };
}

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
export interface MerkleDistributorInfo {
  merkleRoot: string;
  tokenTotal: string;
  claims: {
    [account: string]: {
      index: number;
      amount: string;
      proof: string[];
      flags?: {
        [flag: string]: boolean;
      };
    };
  };
}

export interface MultiMerkleDistributorInfo {
  [token: string]: MerkleDistributorInfo;
}

export interface VoteTracker {
  address: string;
  getReactorKeys: (overrides?: any) => Promise<string[]>;
  interface: {
    encodeFunctionData: (functionFragment: any, values: any) => string;
    decodeFunctionResult: (functionFragment: any, values: any) => any;
  };
  getSystemVotes: (overrides?: any) => Promise<any>;
}

export interface Multicall {
  callStatic: {
    aggregate: (
      calls: any[],
      overrides?: any,
    ) => Promise<[BigNumber, string[]] & { blockNumber: BigNumber; returnData: string[] }>;
  };
}
