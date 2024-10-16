import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { PoolConfigurator } from '@aave/deploy-v3';
import { ReservesSetupHelper } from '../types';

async function deployPoolConfigurator() {
  const [deployer] = await ethers.getSigners();
  const configuratorLogicAddress = readFromFile('configuratorLogic');
  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  if (!configuratorLogicAddress || !poolAddressesProviderAddress) {
    throw new Error('One or more addresses not found');
  }

  const poolConfigurator = await deployContract<PoolConfigurator>(
    'PoolConfigurator',
    [],
    'Pool Configurator',
    {
      libraries: {
        ConfiguratorLogic: configuratorLogicAddress,
      },
    }
  );
  await sendTxn(
    poolConfigurator.initialize(poolAddressesProviderAddress),
    'initialize Pool Configurator'
  );

  const reservesSetupHelper = await deployContract<ReservesSetupHelper>('ReservesSetupHelper', []);

  writeToFile({
    poolConfigurator: poolConfigurator.address,
    reservesSetupHelper: reservesSetupHelper.address,
  });
}

export default deployPoolConfigurator;
