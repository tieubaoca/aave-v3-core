pragma solidity >=0.6.0;

import './AggregatorInterface.sol';
import './AggregatorV3Interface.sol';

interface AggregatorV2V3Interface is AggregatorInterface, AggregatorV3Interface {}
