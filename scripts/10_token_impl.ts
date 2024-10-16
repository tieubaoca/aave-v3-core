import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { AToken, DelegationAwareAToken, PoolAddressesProvider, StableDebtToken } from '../types';
import { VariableDebtToken } from '@aave/deploy-v3';

async function deployTokenImpl() {
  const [deployer] = await ethers.getSigners();

  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  if (!poolAddressesProviderAddress) {
    throw new Error('PoolAddressesProvider address not found');
  }

  const poolAddressesProvider = (await ethers.getContractAt(
    'PoolAddressesProvider',
    poolAddressesProviderAddress
  )) as PoolAddressesProvider;
  const poolAddress = await poolAddressesProvider.getPool();
  const aToken = await deployContract<AToken>('AToken', [poolAddress]);
  await sendTxn(
    aToken.initialize(
      poolAddress,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      0,
      'ATOKEN_IMPL',
      'ATOKEN_IMPL',
      '0x00'
    ),
    'Initialize AToken'
  );
  const delegationAwareAToken = await deployContract<DelegationAwareAToken>(
    'DelegationAwareAToken',
    [poolAddress]
  );

  await sendTxn(
    delegationAwareAToken.initialize(
      poolAddress,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      0,
      'DELEGATION_AWARE_ATOKEN_IMPL',
      'DELEGATION_AWARE_ATOKEN_IMPL',
      '0x00'
    ),
    'Initialize DelegationAwareAToken'
  );

  const stableDebtToken = await deployContract<StableDebtToken>('StableDebtToken', [poolAddress]);
  await sendTxn(
    stableDebtToken.initialize(
      poolAddress,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      0,
      'STABLE_DEBT_TOKEN_IMPL',
      'STABLE_DEBT_TOKEN_IMPL',
      '0x00'
    ),
    'Initialize StableDebtToken'
  );
  const variableDebtToken = await deployContract<VariableDebtToken>('VariableDebtToken', [
    poolAddress,
  ]);
  await sendTxn(
    variableDebtToken.initialize(
      poolAddress,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      0,
      'VARIABLE_DEBT_TOKEN_IMPL',
      'VARIABLE_DEBT_TOKEN_IMPL',
      '0x00'
    ),
    'Initialize VariableDebtToken'
  );

  writeToFile({
    aToken: aToken.address,
    delegationAwareAToken: delegationAwareAToken.address,
    stableDebtToken: stableDebtToken.address,
    variableDebtToken: variableDebtToken.address,
  });
}

export default deployTokenImpl;
