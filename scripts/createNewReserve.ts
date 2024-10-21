import { ethers } from 'hardhat';

import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { rateStrategyVolatileOne } from './config/rateStrategies';
import { eContractid } from '../helpers';
import { IReserveParams } from '../helpers/types';

const strategy: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: '7500',
  liquidationThreshold: '8000',
  liquidationBonus: '10500',
  liquidationProtocolFee: '1000',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  flashLoanEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  supplyCap: '0',
  borrowCap: '0',
  debtCeiling: '0',
  borrowableIsolation: true,
};

async function createNewReserve() {}
