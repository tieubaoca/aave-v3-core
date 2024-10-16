import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { DefaultReserveInterestRateStrategy } from '../types';
import {
  rateStrategyVolatileOne,
  rateStrategyStableOne,
  rateStrategyStableTwo,
} from './config/rateStrategies';

async function initStrategy() {
  const [deployer] = await ethers.getSigners();

  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');

  if (!poolAddressesProviderAddress) {
    throw new Error('One or more addresses not found');
  }

  const volatileOneStrategy = await deployContract<DefaultReserveInterestRateStrategy>(
    'DefaultReserveInterestRateStrategy',
    [
      poolAddressesProviderAddress,
      rateStrategyVolatileOne.optimalUsageRatio,
      rateStrategyVolatileOne.baseVariableBorrowRate,
      rateStrategyVolatileOne.variableRateSlope1,
      rateStrategyVolatileOne.variableRateSlope2,
      rateStrategyVolatileOne.stableRateSlope1,
      rateStrategyVolatileOne.stableRateSlope2,
      rateStrategyVolatileOne.baseStableRateOffset,
      rateStrategyVolatileOne.stableRateExcessOffset,
      rateStrategyVolatileOne.optimalStableToTotalDebtRatio,
    ]
  );
  const stableOneStrategy = await deployContract<DefaultReserveInterestRateStrategy>(
    'DefaultReserveInterestRateStrategy',
    [
      poolAddressesProviderAddress,
      rateStrategyStableOne.optimalUsageRatio,
      rateStrategyStableOne.baseVariableBorrowRate,
      rateStrategyStableOne.variableRateSlope1,
      rateStrategyStableOne.variableRateSlope2,
      rateStrategyStableOne.stableRateSlope1,
      rateStrategyStableOne.stableRateSlope2,
      rateStrategyStableOne.baseStableRateOffset,
      rateStrategyStableOne.stableRateExcessOffset,
      rateStrategyStableOne.optimalStableToTotalDebtRatio,
    ]
  );
  const stableTwoStrategy = await deployContract<DefaultReserveInterestRateStrategy>(
    'DefaultReserveInterestRateStrategy',
    [
      poolAddressesProviderAddress,
      rateStrategyStableTwo.optimalUsageRatio,
      rateStrategyStableTwo.baseVariableBorrowRate,
      rateStrategyStableTwo.variableRateSlope1,
      rateStrategyStableTwo.variableRateSlope2,
      rateStrategyStableTwo.stableRateSlope1,
      rateStrategyStableTwo.stableRateSlope2,
      rateStrategyStableTwo.baseStableRateOffset,
      rateStrategyStableTwo.stableRateExcessOffset,
      rateStrategyStableTwo.optimalStableToTotalDebtRatio,
    ]
  );

  writeToFile({
    rateStrategyVolatileOne: volatileOneStrategy.address,
    rateStrategyStableOne: stableOneStrategy.address,
    rateStrategyStableTwo: stableTwoStrategy.address,
  });
}

export default initStrategy;
