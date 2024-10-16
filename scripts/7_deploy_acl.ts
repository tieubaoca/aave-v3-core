import { ethers } from 'hardhat';
import { deployContract, sendTxn, writeToFile, readFromFile } from './helper';
import { ACLManager, PoolAddressesProvider } from '../types';

async function deployACL() {
  const [deployer] = await ethers.getSigners();
  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  if (!poolAddressesProviderAddress) {
    throw new Error('PoolAddressesProvider address not found');
  }
  const poolAddressesProvider = (await ethers.getContractAt(
    'PoolAddressesProvider',
    poolAddressesProviderAddress
  )) as PoolAddressesProvider;
  await sendTxn(poolAddressesProvider.setACLAdmin(deployer.address), 'Set ACL Admin');
  const aclManager = await deployContract<ACLManager>(
    'ACLManager',
    [poolAddressesProvider.address],
    'ACL Manager'
  );
  await sendTxn(poolAddressesProvider.setACLManager(aclManager.address), 'Set ACL Manager');
  await sendTxn(aclManager.addPoolAdmin(deployer.address), 'Add Pool Admin');

  // set emergency admin

  await sendTxn(aclManager.addEmergencyAdmin(deployer.address), 'Add Emergency Admin');

  writeToFile({
    aclManager: aclManager.address,
  });
}

export default deployACL;
