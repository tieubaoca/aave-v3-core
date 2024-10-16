import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';

import { AaveOracle, PoolAddressesProvider } from '../types';
import getAaveOracleParams from './params/aaveOracleParams';

async function deployAaveOracle() {
  const [deployer] = await ethers.getSigners();
  const aaveOracleParams = getAaveOracleParams();
  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  const poolAddressesProvider = (await ethers.getContractAt(
    'PoolAddressesProvider',
    poolAddressesProviderAddress
  )) as PoolAddressesProvider;
  if (aaveOracleParams[0] !== poolAddressesProviderAddress) {
    console.log('aaveOracleParams[0]:', aaveOracleParams[0]);
    throw new Error('Invalid poolAddressesProviderAddress');
  }
  const aaveOracle = await deployContract<AaveOracle>('AaveOracle', aaveOracleParams);
  await sendTxn(
    poolAddressesProvider.setPriceOracle(aaveOracle.address),
    'Set AaveOracle as price oracle'
  );
  writeToFile({
    aaveOracle: aaveOracle.address,
  });
}

export default deployAaveOracle;
