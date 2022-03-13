import * as dotenv from 'dotenv';
import { BigNumber, utils } from 'ethers';

dotenv.config();

export function getEnvError(variable: string): string {
  const envVariable: string | undefined = process.env[variable];
  if (!envVariable) {
    throw new Error(`Please set your ${variable} in a .env file`);
  }
  return envVariable;
}

export function getEnvWarn(variable: string): string | undefined {
  const envVariable: string | undefined = process.env[variable];
  if (!envVariable) {
    console.log(`Optional: set a ${variable} in a .env file`);
  }
  return envVariable;
}

export function getBribeIdentifier(
  key: string,
  proposal: string,
  round: BigNumber,
  token: string
): string {
  return utils.solidityKeccak256(
    ['string', 'address', 'uint256', 'address'],
    [key, proposal, round, token]
  );
}

export function getRewardIdentifier(key: string, round: BigNumber, token: string): string {
  return utils.solidityKeccak256(['string', 'uint256', 'address'], [key, round, token]);
}
