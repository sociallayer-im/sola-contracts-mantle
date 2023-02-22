import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Mintable", function () {

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Mintable = await ethers.getContractFactory("Mintable");
      let mintable = await upgrades.deployProxy(Mintable, []);
      await mintable.deployed();
      console.log("mintable deployed to:", mintable.address);

      await mintable.mint(owner.address)
      console.log('owner', await mintable.ownerOf(1))

      await mintable.transferFrom(owner.address, otherAccount.address, 1)
      console.log('owner', await mintable.ownerOf(1))
    });
  });
});
