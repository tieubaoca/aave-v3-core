import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from './helper';
import { CustomAggregator } from '../types';

async function deployPriceAggregator() {
  const [deployer] = await ethers.getSigners();
  const wethPriceAggregator = await deployContract<CustomAggregator>('CustomAggregator', [
    8,
    'ETH/USD Aggregator',
  ]);
  await sendTxn(
    wethPriceAggregator.updateAnswer(ethers.utils.parseUnits('4000', 8)),
    'Update WETH price'
  );
  const usdtPriceAggregator = await deployContract<CustomAggregator>('CustomAggregator', [
    8,
    'USDT/USD Aggregator',
  ]);
  await sendTxn(
    usdtPriceAggregator.updateAnswer(ethers.utils.parseUnits('1', 8)),
    'Update USDT price'
  );
  const usdcPriceAggregator = await deployContract<CustomAggregator>('CustomAggregator', [
    8,
    'USDC/USD Aggregator',
  ]);
  await sendTxn(
    usdcPriceAggregator.updateAnswer(ethers.utils.parseUnits('1', 8)),
    'Update USDC price'
  );

  const btcAggregator = await deployContract<CustomAggregator>('CustomAggregator', [
    8,
    'BTC/USD Aggregator',
  ]);
  await sendTxn(
    btcAggregator.updateAnswer(ethers.utils.parseUnits('60000', 8)),
    'Update BTC price'
  );

  writeToFile({
    wethPriceAggregator: wethPriceAggregator.address,
    usdtPriceAggregator: usdtPriceAggregator.address,
    usdcPriceAggregator: usdcPriceAggregator.address,
    btcAggregator: btcAggregator.address,
  });
}

export default deployPriceAggregator;
