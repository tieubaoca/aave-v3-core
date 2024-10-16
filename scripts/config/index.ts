import { ZERO_ADDRESS } from '../../helpers';
import { IAaveConfiguration } from '../../helpers/types';

import { strategyUSDC, strategyWETH, strategyUSDT } from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

// export const Market: IAaveConfiguration = {
//   MarketId: 'Blast Test Market',
//   ATokenNamePrefix: 'Blast',
//   StableDebtTokenNamePrefix: 'Blast',
//   VariableDebtTokenNamePrefix: 'Blast',
//   SymbolPrefix: 'BLT',
//   ProviderId: 40,
//   TestnetMarket: true,
//   ProviderRegistryOwner: '0x',
//   FallbackOracle: ZERO_ADDRESS,
//   ReservesConfig: {
//     USDC: strategyUSDC,
//     WETH: strategyWETH,
//     USDT: strategyUSDT,
//   },
//   ReserveAssets: {
//     USDC: ZERO_ADDRESS,
//     WETH: '0x4300000000000000000000000000000000000004',
//     USDT: ZERO_ADDRESS,
//   },
//   ChainlinkAggregator: {
//     USDC: '0xA4b3e6917CbFc9c2de9701AE614aC580C81338ea',
//     WETH: '0x5bF961Bfae6a16a45B2c74236a554a12D131CF9d',
//     USDT: '0x2Da696F4924a361C659467E3001E5dbB89186165',
//   },
//   ReserveFactorTreasuryAddress: '0x0000000000000000000000000000000000000000',

//   EModes: {
//     StableEMode: {
//       id: '1',
//       ltv: '9700',
//       liquidationThreshold: '9750',
//       liquidationBonus: '10100',
//       label: 'Stablecoins',
//       assets: ['USDC', 'USDT'],
//     },
//   },
// };

// export default Market;
