import { ethers } from 'hardhat';
import { deployContract, readFromFile, sendTxn, writeToFile } from '../helper';
import deployTestToken from '../0_deploy_test_token';
import deployMarketsRegistry from '../1_deploy_markets_registry';
import deployLogicLibraries from '../2_deploy_logic_libraries';
import deployPriceAggregator from '../3_deploy_price_aggregator';
import deployAddressesProvider from '../4_deploy_addresses_provider';
import deployPoolImpl from '../5_deloy_pool_impl';
import deployPoolConfigurator from '../6_deploy_pool_configurator';
import deployACL from '../7_deploy_acl';
import deployAaveOracle from '../8_deploy_aave_oracle';
import initPool from '../9_init_pool';
import deployTokenImpl from '../10_token_impl';
import initStrategy from '../11_init_strategy';
import initReserves from '../12_init_reserves';

async function deploy() {
  // console.log(`0. Deploying test tokens`);
  // await deployTestToken();
  console.log(`1. Deploying markets registry`);
  await deployMarketsRegistry();
  console.log(`2. Deploying logic libraries`);
  await deployLogicLibraries();
  // console.log(`3. Deploying price aggregator`);
  // await deployPriceAggregator();
  console.log(`4. Deploying addresses provider`);
  await deployAddressesProvider();
  console.log(`5. Deploying pool impl`);
  await deployPoolImpl();
  console.log(`6. Deploying pool configurator`);
  await deployPoolConfigurator();
  console.log(`7. Deploying ACL`);
  await deployACL();
  console.log(`8. Deploying Aave Oracle`);
  await deployAaveOracle();
  console.log(`9. Initializing pool`);
  await initPool();
  console.log(`10. Deploying token impl`);
  await deployTokenImpl();
  console.log(`11. Initializing strategy`);
  await initStrategy();
  console.log(`12. Initializing reserves`);
  await initReserves();
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
