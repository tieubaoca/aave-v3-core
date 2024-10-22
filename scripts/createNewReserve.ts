import { ethers } from 'hardhat';
import {
  DefaultReserveInterestRateStrategy,
  PoolAddressesProvider,
  PoolConfigurator,
  ACLManager,
  ReservesSetupHelper,
  MintableERC20,
  CustomAggregator,
} from '../types';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { rateStrategyVolatileOne } from './config/rateStrategies';
import { eContractid } from '../helpers';
import { IReserveParams } from '../helpers/types';
import { BigNumberish } from '@ethersproject/bignumber';

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
  supplyCap: '100',
  borrowCap: '100',
  debtCeiling: '0',
  borrowableIsolation: true,
};

async function createNewReserve() {
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

  const tokenSymbol = 'BNB';
  const tokenDecimals = '18';
  const tokenName = 'Binance Coin';
  const initPrice = 400;

  const token = await deployContract<MintableERC20>('MintableERC20', [
    tokenName,
    tokenSymbol,
    tokenDecimals,
  ]);
  const priceAggregator = await deployContract<CustomAggregator>('CustomAggregator', [
    8,
    `${tokenSymbol}/USD`,
  ]);
  await sendTxn(priceAggregator.updateAnswer(initPrice * 1e8), 'Update price');

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

  initInputParams.push({
    aTokenImpl: readFromFile('aToken'),
    stableDebtTokenImpl: readFromFile('stableDebtToken'),
    variableDebtTokenImpl: readFromFile('variableDebtToken'),
    underlyingAssetDecimals: strategy.reserveDecimals,
    interestRateStrategyAddress: readFromFile(strategy.strategy.name),
    underlyingAsset: token.address,
    treasury: treasuryAddress,
    incentivesController: incentiveControllerAddress,
    underlyingAssetName: tokenName,
    aTokenName: `A${tokenSymbol}`,
    aTokenSymbol: `a${tokenSymbol}`,
    variableDebtTokenName: `VariableDebt${tokenSymbol}`,
    variableDebtTokenSymbol: `v${tokenSymbol}`,
    stableDebtTokenName: `StableDebt${tokenSymbol}`,
    stableDebtTokenSymbol: `s${tokenSymbol}`,
    params: '0x10',
  });
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

  inputParams.push({
    asset: token.address,
    baseLTV: strategy.baseLTVAsCollateral,
    liquidationThreshold: strategy.liquidationThreshold,
    liquidationBonus: strategy.liquidationBonus,
    reserveFactor: strategy.reserveFactor,
    borrowCap: strategy.borrowCap,
    supplyCap: strategy.supplyCap,
    stableBorrowingEnabled: strategy.stableBorrowRateEnabled,
    borrowingEnabled: strategy.borrowingEnabled,
    flashLoanEnabled: strategy.flashLoanEnabled,
  });

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
  const lowerCaseTokenSymbol = tokenSymbol.toLowerCase();
  const priceAggregatorName = `${lowerCaseTokenSymbol}PriceAggregator`;
  writeToFile({
    lowerCaseTokenSymbol: token.address,
    priceAggregatorName: priceAggregator.address,
  });
}

createNewReserve()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
