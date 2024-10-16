import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { PoolAddressesProvider } from '../types';
import { PoolConfigurator } from '@aave/deploy-v3';

async function initPool() {
  const [deployer] = await ethers.getSigners();
  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  const poolConfiguratorAddress = readFromFile('poolConfigurator');
  const poolImpl = readFromFile('poolImpl');

  if (!poolAddressesProviderAddress || !poolConfiguratorAddress || !poolImpl) {
    throw new Error('One or more addresses not found');
  }
  const poolAddressesProvider = (await ethers.getContractAt(
    'PoolAddressesProvider',
    poolAddressesProviderAddress
  )) as PoolAddressesProvider;
  await sendTxn(poolAddressesProvider.setPoolImpl(poolImpl), 'Set Pool Implementation');
  const poolProxy = await poolAddressesProvider.getPool();
  await sendTxn(
    poolAddressesProvider.setPoolConfiguratorImpl(poolConfiguratorAddress),
    'Set Pool Configurator Implementation'
  );
  const poolConfiguratorProxy = await poolAddressesProvider.getPoolConfigurator();

  const poolConfigurator = (await ethers.getContractAt(
    'PoolConfigurator',
    poolConfiguratorProxy
  )) as PoolConfigurator;

  await sendTxn(
    poolConfigurator.updateFlashloanPremiumTotal(
      5 // 0.0005e4
    ),
    'Set flashloan premium'
  );
  await sendTxn(
    poolConfigurator.updateFlashloanPremiumToProtocol(
      4 // 0.0004e4
    ),
    'Set flashloan premium to protocol'
  );

  writeToFile({
    poolConfiguratorProxy: poolConfiguratorProxy,
    poolProxy: poolProxy,
  });
}

export default initPool;
