import { ethers } from 'hardhat';
import { deployContract, sendTxn, writeToFile, readFromFile } from './helper';
import { AaveProtocolDataProvider, PoolAddressesProvider } from '@aave/deploy-v3';
import { read } from 'fs';
import { PoolAddressesProviderRegistry } from '../types';

async function deployAddressesProvider() {
  const [deployer] = await ethers.getSigners();
  const poolAddressesProviderRegistryAddress = readFromFile('poolAddressesProviderRegistry');
  if (!poolAddressesProviderRegistryAddress) {
    throw new Error('PoolAddressesProviderRegistry address not found');
  }
  const poolAddressesProviderRegistry = (await ethers.getContractAt(
    'PoolAddressesProviderRegistry',
    poolAddressesProviderRegistryAddress
  )) as PoolAddressesProviderRegistry;
  const poolAddressesProvider = await deployContract<PoolAddressesProvider>(
    'PoolAddressesProvider',
    ['MARKET ID', deployer.address]
  );
  await sendTxn(
    poolAddressesProviderRegistry.registerAddressesProvider(poolAddressesProvider.address, 1),
    'Register PoolAddressesProvider'
  );

  const protocolDataProvider = await deployContract<AaveProtocolDataProvider>(
    'AaveProtocolDataProvider',
    [poolAddressesProvider.address]
  );
  await sendTxn(
    poolAddressesProvider.setPoolDataProvider(protocolDataProvider.address),
    'Set ProtocolDataProvider'
  );

  writeToFile({
    poolAddressesProvider: poolAddressesProvider.address,
    protocolDataProvider: protocolDataProvider.address,
  });
}

export default deployAddressesProvider;
