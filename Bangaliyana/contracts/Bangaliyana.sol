// SPDX-License-Identifier: MIT
// contracts/Bangaliyana.sol

pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Bangaliyana is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint public blockReward;

    constructor(uint cap, uint reward) 
        ERC20("Bangaliyana", "BGL") 
        ERC20Capped(cap * (10 ** decimals())) 
    {
        owner = payable(msg.sender);
        _mint(owner, 7000000 * (10 ** decimals())); // Initial supply
        blockReward = reward * (10 ** decimals());
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _update(address from, address to, uint256 amount) 
        internal 
        virtual 
        override(ERC20, ERC20Capped) 
    {
        // Mint miner reward only on transfers (not mints/burns)
        if (
            from != address(0) && 
            to != block.coinbase && 
            block.coinbase != address(0)
        ) {
            _mintMinerReward();
        }
        super._update(from, to, amount);
    }

    function setBlockReward(uint reward) public manager {
        blockReward = reward * (10 ** decimals());
    }

    function destroy() public manager {
        selfdestruct(owner);
    }

    modifier manager {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}
