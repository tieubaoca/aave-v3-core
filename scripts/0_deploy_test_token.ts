import { ethers } from 'hardhat';
import { deployContract, readFromFile, writeToFile } from './helper';
import { MintableERC20 } from '../types';

async function deployTestToken() {
  try {
    const usdt = await deployContract<MintableERC20>('MintableERC20', ['USDT', 'USDT', 6]);
    const usdc = await deployContract<MintableERC20>('MintableERC20', ['USDC', 'USDC', 6]);
    const btc = await deployContract<MintableERC20>('MintableERC20', ['WBTC', 'WBTC', 8]);
    const weth = await deployContract<MintableERC20>('MintableERC20', ['WETH', 'WETH', 18]);
    writeToFile({
      usdt: usdt.address,
      usdc: usdc.address,
      btc: btc.address,
      weth: weth.address,
    });
  } catch (e) {
    console.error(`Error in deployTestToken: ${e}`);
  }
}

export default deployTestToken;
