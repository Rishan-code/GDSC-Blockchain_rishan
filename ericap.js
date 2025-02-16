const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ecp contract", function() {
  // global variables
  let Token;
  let ecp;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("ecp");
    [owner, addr1, addr2] = await ethers.getSigners();

    ecp = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function () {
      expect(await ecp.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await ecp.balanceOf(owner.address);
      expect(await ecp.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await ecp.cap();
      expect(Number(ethers.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await ecp.blockreward();
      expect(Number(ethers.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });
  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await ecp.transfer(addr1.address, 50);
      const addr1Balance = await ecp.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await ecp.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await ecp.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await ecp.balanceOf(owner.address);
      await expect(
        ecp.connect(addr1).transfer(addr2.address, 1)
      ).to.be.revertedWithCustomError(ecp, "ERC20InsufficientBalance");
    });
    
    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await ecp.balanceOf(owner.address);
      
      await ecp.transfer(addr1.address, 100);
      await ecp.transfer(addr2.address, 50);
    
      const finalOwnerBalance = await ecp.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));
    
      const addr1Balance = await ecp.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(BigInt(100));
    
      const addr2Balance = await ecp.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(BigInt(50));
    });
    
  });
});
