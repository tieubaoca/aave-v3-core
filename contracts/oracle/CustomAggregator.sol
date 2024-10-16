// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/AggregatorV2V3Interface.sol';
import '../dependencies/openzeppelin/contracts/AccessControl.sol';

/**
 * @title A trusted proxy for updating where current answers are read from
 * @notice This contract provides a consistent address for the
 * CurrentAnwerInterface but delegates where it reads from to the owner, who is
 * trusted to update it.
 */
contract CustomAggregator is AggregatorV2V3Interface, AccessControl {
  bytes32 public constant PRICE_UPDATER_ROLE = keccak256('PRICE_UPDATER_ROLE');

  uint8 _decimals;
  string _description;
  uint256 _roundId;

  mapping(uint256 => Round) internal _rounds;

  struct Round {
    int256 answer;
    uint256 timestamp;
  }

  constructor(uint8 _priceDecimals, string memory _descriptionAgg) {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(PRICE_UPDATER_ROLE, msg.sender);
    _decimals = _priceDecimals;
    _description = _descriptionAgg;
  }

  function latestAnswer() external view override returns (int256) {
    return _rounds[_roundId].answer;
  }

  function latestTimestamp() external view override returns (uint256) {
    return _rounds[_roundId].timestamp;
  }

  function latestRound() external view override returns (uint256) {
    return _roundId;
  }

  function getAnswer(uint256 roundId) external view override returns (int256) {
    return _rounds[roundId].answer;
  }

  function getTimestamp(uint256 roundId) external view override returns (uint256) {
    return _rounds[roundId].timestamp;
  }

  function updateAnswer(int256 _answer) external onlyRole(PRICE_UPDATER_ROLE) {
    _roundId += 1;
    _rounds[_roundId].answer = _answer;
    _rounds[_roundId].timestamp = block.timestamp;
  }

  function decimals() external view override returns (uint8) {
    return _decimals;
  }

  function description() external view override returns (string memory) {
    return _description;
  }

  function version() external view override returns (uint256) {
    return 0;
  }

  // getRoundData and latestRoundData should both raise "No data present"
  // if they do not have data to report, instead of returning unset values
  // which could be misinterpreted as actual reported values.
  function getRoundData(
    uint80 roundId_
  )
    external
    view
    override
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    )
  {
    return (
      uint80(roundId_),
      _rounds[roundId_].answer,
      _rounds[roundId_].timestamp,
      _rounds[roundId_].timestamp,
      0
    );
  }

  function latestRoundData()
    external
    view
    override
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    )
  {
    return (
      uint80(_roundId),
      _rounds[_roundId].answer,
      _rounds[_roundId].timestamp,
      _rounds[_roundId].timestamp,
      0
    );
  }
}
