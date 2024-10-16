import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { PoolAddressesProviderRegistry } from '@aave/deploy-v3';

async function deployMarketsRegistry() {
  try {
    const [deployer] = await ethers.getSigners();
    const poolAddressesProviderRegistry = await deployContract<PoolAddressesProviderRegistry>(
      'PoolAddressesProviderRegistry',
      [deployer.address]
    );
    writeToFile({ poolAddressesProviderRegistry: poolAddressesProviderRegistry.address });
  } catch (e) {
    console.error(`Error in deployMarketsRegistry: ${e}`);
  }
}

export = deployMarketsRegistry;
