const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseUnits } = ethers;

describe("Bangaliyana contract", function () {
  let Token;
  let bangaliyana;
  let owner, addr1, addr2;
  const tokenCap = "100000000";
  const tokenBlockReward = "50";

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Bangaliyana");
    [owner, addr1, addr2] = await ethers.getSigners();
    bangaliyana = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await bangaliyana.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await bangaliyana.balanceOf(owner.address);
      expect(await bangaliyana.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await bangaliyana.cap();
      expect(cap).to.equal(parseUnits(tokenCap, 18));
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await bangaliyana.blockReward();
      expect(blockReward).to.equal(parseUnits(tokenBlockReward, 18));
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await bangaliyana.transfer(addr1.address, parseUnits("50", 18));
      const addr1Balance = await bangaliyana.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(parseUnits("50", 18));

      await bangaliyana.connect(addr1).transfer(addr2.address, parseUnits("50", 18));
      const addr2Balance = await bangaliyana.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(parseUnits("50", 18));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await bangaliyana.balanceOf(owner.address);

      // Just check it reverts without error string (due to custom errors)
      await expect(
        bangaliyana.connect(addr1).transfer(owner.address, parseUnits("1", 18))
      ).to.be.reverted;

      expect(await bangaliyana.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await bangaliyana.balanceOf(owner.address);

      await bangaliyana.transfer(addr1.address, parseUnits("100", 18));
      await bangaliyana.transfer(addr2.address, parseUnits("50", 18));

      const finalOwnerBalance = await bangaliyana.balanceOf(owner.address);

      // Use native bigint subtraction
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - parseUnits("150", 18));

      expect(await bangaliyana.balanceOf(addr1.address)).to.equal(parseUnits("100", 18));
      expect(await bangaliyana.balanceOf(addr2.address)).to.equal(parseUnits("50", 18));
    });
  });
});


