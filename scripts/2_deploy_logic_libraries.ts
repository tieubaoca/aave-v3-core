import { ethers } from 'hardhat';
import { deployContract, readFromFile, writeToFile } from './helper';
import {
  BorrowLogic,
  BridgeLogic,
  EModeLogic,
  LiquidationLogic,
  PoolLogic,
  SupplyLogic,
  ConfiguratorLogic,
  FlashLoanLogic,
} from '../types';
import { libraries } from '../types/protocol';

async function deployLogicLibraries() {
  try {
    const supplyLogic = await deployContract<SupplyLogic>('SupplyLogic', []);
    const borrowLogic = await deployContract<BorrowLogic>('BorrowLogic', []);
    const liquidationLogic = await deployContract<LiquidationLogic>('LiquidationLogic', []);
    const eModeLogic = await deployContract<EModeLogic>('EModeLogic', []);
    const bridgeLogic = await deployContract<BridgeLogic>('BridgeLogic', []);
    const configuratorLogic = await deployContract<ConfiguratorLogic>('ConfiguratorLogic', []);
    const flashLoanLogic = await deployContract<FlashLoanLogic>(
      'FlashLoanLogic',
      [],
      'FlashLoanLogic',
      {
        libraries: {
          BorrowLogic: borrowLogic.address,
        },
      }
    );
    const poolLogic = await deployContract<PoolLogic>('PoolLogic', []);

    writeToFile({
      supplyLogic: supplyLogic.address,
      borrowLogic: borrowLogic.address,
      liquidationLogic: liquidationLogic.address,
      eModeLogic: eModeLogic.address,
      bridgeLogic: bridgeLogic.address,
      configuratorLogic: configuratorLogic.address,
      flashLoanLogic: flashLoanLogic.address,
      poolLogic: poolLogic.address,
    });
  } catch (e) {
    console.error(`Error in deployLogicLibraries: ${e}`);
  }
}

export = deployLogicLibraries;
