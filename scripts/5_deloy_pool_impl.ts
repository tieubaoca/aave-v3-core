import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { Pool } from '../types';

async function deployPoolImpl() {
  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  const borrowLogicAddress = readFromFile('borrowLogic');
  const bridgeLogicAddress = readFromFile('bridgeLogic');
  const eModeLogicAddress = readFromFile('eModeLogic');
  const flashLoanLogicAddress = readFromFile('flashLoanLogic');
  const liquidationLogicAddress = readFromFile('liquidationLogic');
  const poolLogicAddress = readFromFile('poolLogic');
  const supplyLogicAddress = readFromFile('supplyLogic');
  if (
    !poolAddressesProviderAddress ||
    !borrowLogicAddress ||
    !bridgeLogicAddress ||
    !eModeLogicAddress ||
    !flashLoanLogicAddress ||
    !liquidationLogicAddress ||
    !poolLogicAddress ||
    !supplyLogicAddress
  ) {
    throw new Error('One or more addresses not found');
  }

  const poolImpl = await deployContract<Pool>(
    'Pool',
    [poolAddressesProviderAddress],
    'Pool Implementation',
    {
      libraries: {
        BorrowLogic: borrowLogicAddress,
        BridgeLogic: bridgeLogicAddress,
        EModeLogic: eModeLogicAddress,
        FlashLoanLogic: flashLoanLogicAddress,
        LiquidationLogic: liquidationLogicAddress,
        PoolLogic: poolLogicAddress,
        SupplyLogic: supplyLogicAddress,
      },
    }
  );

  await sendTxn(
    poolImpl.initialize(poolAddressesProviderAddress),
    'initialize Pool Implementation'
  );

  writeToFile({
    poolImpl: poolImpl.address,
  });
}

export default deployPoolImpl;
