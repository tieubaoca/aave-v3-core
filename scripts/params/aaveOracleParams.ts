import { ethers } from 'hardhat';
import { readFromFile } from '../helper';
import { get } from 'http';

function getAaveOracleParams() {
  const ethPriceAggregatorAddress = readFromFile('wethPriceAggregator');
  const usdtPriceAggregatorAddress = readFromFile('usdtPriceAggregator');
  const usdcPriceAggregatorAddress = readFromFile('usdcPriceAggregator');
  const btcAggregatorAddress = readFromFile('btcAggregator');
  const usdtAddress = readFromFile('usdt');
  const usdcAddress = readFromFile('usdc');
  const ethAddress = readFromFile('weth');
  const btcAddress = readFromFile('btc');

  const poolAddressesProviderAddress = readFromFile('poolAddressesProvider');
  const fallbackOracle = ethers.constants.AddressZero;
  const baseCurrency = ethers.constants.AddressZero;
  const baseCurrencyUnit = ethers.utils.parseUnits('1', 8).toString();

  const assets = [usdtAddress, usdcAddress, ethAddress, btcAddress];
  const sources = [
    ethPriceAggregatorAddress,
    usdtPriceAggregatorAddress,
    usdcPriceAggregatorAddress,
    btcAggregatorAddress,
  ];

  const params = [
    poolAddressesProviderAddress,
    assets,
    sources,
    fallbackOracle,
    baseCurrency,
    baseCurrencyUnit,
  ];
  return params;
}
export default getAaveOracleParams;
