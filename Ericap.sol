// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Ericap is ERC20Capped, ERC20Burnable{
    address payable public owner;
    uint256 public blockreward;
    bool public isActive = true; 
  constructor(uint256 cap,uint256 reward) ERC20("Ericap","ecp") ERC20Capped(cap*(10 **18))
  {
    owner = payable(msg.sender);
    _mint(owner,70000000*(10**18));
    blockreward = reward * (10** 18);
  }

    function _mintMinerReward() internal{
        if(block.coinbase != address(0)){
        _mint(block.coinbase,blockreward);
        }
    }

   function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped) {
    if (from == address(0)) {
        require(totalSupply() + value <= cap(), "ERC20Capped: cap exceeded");
    }
    
    if (from != address(0) && to != block.coinbase && block.coinbase != address(0) && totalSupply() + blockreward <= cap()) {
        _mintMinerReward();
    }
    
    super._update(from, to, value);
}


  function setBlockReward(uint256 reward) public onlyOwner{
    blockreward = reward * (10 ** 18);

  }

   function disableContract() public onlyOwner {
        isActive = false;
    }
    modifier contractActive() {
        require(isActive, "Contract is disabled");
        _;
    }

  modifier onlyOwner{
    require(msg.sender == owner,"Only owner can call this function");
    _;
  }
}