import path from 'path';
import { HardhatUserConfig } from 'hardhat/types';
// @ts-ignore
import { accounts } from './test-wallets.js';
import { COVERAGE_CHAINID, HARDHAT_CHAINID } from './helpers/constants';
import { buildForkConfig } from './helper-hardhat-config';

require('dotenv').config();

import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import '@tenderly/hardhat-tenderly';
import 'hardhat-contract-sizer';
import 'hardhat-dependency-compiler';
import '@nomicfoundation/hardhat-chai-matchers';

import { DEFAULT_NAMED_ACCOUNTS } from '@aave/deploy-v3';
import { ethers } from 'hardhat';
import { task, subtask } from 'hardhat/config';

const TASK_VERIFY_GET_ETHERSCAN_ENDPOINT = 'verify:get-etherscan-endpoint';
const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const HARDFORK = 'london';
// const customChains = {
//   '168587773': {
//     chainId: 168587773,
//     urls: {
//       apiURL: 'https://api-sepolia.blastscan.io/api',
//       browserURL: 'https://sepolia.blastscan.io/',
//     },
//   },
//   '81457': {
//     chainId: 81457,
//     urls: {
//       apiURL: 'https://api.blastscan.io/api',
//       browserURL: 'https://blastscan.io/',
//     },
//   },
// };

// subtask(TASK_VERIFY_GET_ETHERSCAN_ENDPOINT).setAction(async (_, { network }) => {
//   const chainId = parseInt(await network.provider.send('eth_chainId'), 16);
//   const urls = customChains[chainId].urls;
//   return urls;
// });
const hardhatConfig: HardhatUserConfig = {
  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    // Docs for the compiler https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
          evmVersion: 'london',
        },
      },
      {
        version: '0.6.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
    bail: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT || '',
    username: process.env.TENDERLY_USERNAME || '',
    forkNetwork: '1', //Network id of the network we want to fork
  },
  networks: {
    coverage: {
      url: 'http://localhost:8555',
      chainId: COVERAGE_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
    },
    hardhat: {
      hardfork: HARDFORK,
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      chainId: HARDHAT_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      forking: buildForkConfig(),
      allowUnlimitedContractSize: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
    },
    ganache: {
      url: 'http://localhost:8545',
      accounts: {
        mnemonic:
          'misery, energy, fitness, glove, cook, casual, regret, craft, ship, inspire, lazy, horror',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
    blastSepolia: {
      url: 'https://sepolia.blast.io',
      accounts: process.env.BLAST_SEPOLIA_PRIVATE_KEY
        ? [process.env.BLAST_SEPOLIA_PRIVATE_KEY]
        : [],
    },
  },
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  external: {
    contracts: [
      {
        artifacts: './temp-artifacts',
        deploy: 'node_modules/@aave/deploy-v3/dist/deploy',
      },
    ],
  },
  etherscan: {
    apiKey: 'CT4NB7IQQC5TYKP2MSI8BKUPGIBSTK6JA7y',
    customChains: [
      {
        network: 'blastSepolia',
        chainId: 168587773,
        urls: {
          apiURL: 'https://api-sepolia.blastscan.io/api',
          browserURL: 'https://sepolia.blastscan.io/',
        },
      },
      {
        network: 'blastMainnet',
        chainId: 81457,
        urls: {
          apiURL: 'https://api.blastscan.io/api',
          browserURL: 'https://blastscan.io/',
        },
      },
    ],
  },
};

export default hardhatConfig;
