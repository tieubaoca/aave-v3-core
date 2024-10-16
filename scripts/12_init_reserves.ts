import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import {
  DefaultReserveInterestRateStrategy,
  PoolAddressesProvider,
  PoolConfigurator,
} from '../types';
import {
  rateStrategyVolatileOne,
  rateStrategyStableOne,
  rateStrategyStableTwo,
} from './config/rateStrategies';
import { BigNumberish } from '@ethersproject/bignumber';
import { getReservesConfig } from './config/reservesConfigs';
import { ACLManager, ReservesSetupHelper } from '@aave/deploy-v3';

async function initReserves() {
  const [deployer] = await ethers.getSigners();
  const reservesSetupHelperAddress = readFromFile('reservesSetupHelper');
  const wethPriceAggregatorAddress = readFromFile('wethPriceAggregator');
  const usdtPriceAggregatorAddress = readFromFile('usdtPriceAggregator');
  const usdcPriceAggregatorAddress = readFromFile('usdcPriceAggregator');
  const btcAggregatorAddress = readFromFile('btcAggregator');
  const aaveOracleAddress = readFromFile('aaveOracle');
  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  const treasuryAddress = readFromFile('treasuryProxy');
  const incentiveControllerAddress = readFromFile('rewardController');
  if (
    !reservesSetupHelperAddress ||
    !wethPriceAggregatorAddress ||
    !usdtPriceAggregatorAddress ||
    !usdcPriceAggregatorAddress ||
    !btcAggregatorAddress ||
    !aaveOracleAddress ||
    !poolAddressesProviderAddress
  ) {
    throw new Error('One or more addresses not found');
  }
  const poolAddressesProvider = (await ethers.getContractAt(
    'PoolAddressesProvider',
    poolAddressesProviderAddress
  )) as PoolAddressesProvider;
  const aclManagerAddress = await poolAddressesProvider.getACLManager();
  const poolConfiguratorProxyAddress = await poolAddressesProvider.getPoolConfigurator();
  const aclManager = (await ethers.getContractAt('ACLManager', aclManagerAddress)) as ACLManager;
  const reservesSetupHelper = (await ethers.getContractAt(
    'ReservesSetupHelper',
    reservesSetupHelperAddress
  )) as ReservesSetupHelper;

  const poolConfigurator = (await ethers.getContractAt(
    'PoolConfigurator',
    poolConfiguratorProxyAddress
  )) as PoolConfigurator;
  const reservesSymbol = ['usdt', 'usdc', 'weth', 'btc'];

  let initInputParams: {
    aTokenImpl: string;
    stableDebtTokenImpl: string;
    variableDebtTokenImpl: string;
    underlyingAssetDecimals: BigNumberish;
    interestRateStrategyAddress: string;
    underlyingAsset: string;
    treasury: string;
    incentivesController: string;
    underlyingAssetName: string;
    aTokenName: string;
    aTokenSymbol: string;
    variableDebtTokenName: string;
    variableDebtTokenSymbol: string;
    stableDebtTokenName: string;
    stableDebtTokenSymbol: string;
    params: string;
  }[] = [];

  for (let i = 0; i < reservesSymbol.length; i++) {
    const reserveConfig = getReservesConfig(reservesSymbol[i]);
    initInputParams.push({
      aTokenImpl: readFromFile('aToken'),
      stableDebtTokenImpl: readFromFile('stableDebtToken'),
      variableDebtTokenImpl: readFromFile('variableDebtToken'),
      underlyingAssetDecimals: reserveConfig.reserveDecimals,
      interestRateStrategyAddress: readFromFile(reserveConfig.strategy.name),
      underlyingAsset: readFromFile(reservesSymbol[i]),
      treasury: treasuryAddress,
      incentivesController: incentiveControllerAddress,
      underlyingAssetName: reservesSymbol[i].toUpperCase(),
      aTokenName: `AToken ${reservesSymbol[i].toUpperCase()}`,
      aTokenSymbol: `a${reservesSymbol[i].toUpperCase()}`,
      variableDebtTokenName: `VariableDebtToken ${reservesSymbol[i].toUpperCase()}`,
      variableDebtTokenSymbol: `v${reservesSymbol[i].toUpperCase()}`,
      stableDebtTokenName: `StableDebtToken ${reservesSymbol[i].toUpperCase()}`,
      stableDebtTokenSymbol: `s${reservesSymbol[i].toUpperCase()}`,
      params: '0x10',
    });
  }

  await sendTxn(poolConfigurator.initReserves(initInputParams), 'Init Reserves');

  const inputParams: {
    asset: string;
    baseLTV: BigNumberish;
    liquidationThreshold: BigNumberish;
    liquidationBonus: BigNumberish;
    reserveFactor: BigNumberish;
    borrowCap: BigNumberish;
    supplyCap: BigNumberish;
    stableBorrowingEnabled: boolean;
    borrowingEnabled: boolean;
    flashLoanEnabled: boolean;
  }[] = [];

  for (let i = 0; i < reservesSymbol.length; i++) {
    const reserveConfig = getReservesConfig(reservesSymbol[i]);
    inputParams.push({
      asset: readFromFile(reservesSymbol[i]),
      baseLTV: reserveConfig.baseLTVAsCollateral,
      liquidationThreshold: reserveConfig.liquidationThreshold,
      liquidationBonus: reserveConfig.liquidationBonus,
      reserveFactor: reserveConfig.reserveFactor,
      borrowCap: reserveConfig.borrowCap,
      supplyCap: reserveConfig.supplyCap,
      stableBorrowingEnabled: reserveConfig.stableBorrowRateEnabled,
      borrowingEnabled: reserveConfig.borrowingEnabled,
      flashLoanEnabled: reserveConfig.flashLoanEnabled,
    });
  }

  await sendTxn(
    aclManager.addRiskAdmin(reservesSetupHelperAddress),
    'Add Risk Admin to ReservesSetupHelper'
  );

  await sendTxn(
    reservesSetupHelper.configureReserves(poolConfiguratorProxyAddress, inputParams),
    'Configure Reserves'
  );

  await sendTxn(
    aclManager.removeRiskAdmin(reservesSetupHelperAddress),
    'Remove Risk Admin from ReservesSetupHelper'
  );
}

export default initReserves;
