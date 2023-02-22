import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Badge", function () {

  describe("Deployment", function () {
    it("Should be able to mint", async function () {
      const [owner, otherAccount] = await ethers.getSigners();

      const Badge = await ethers.getContractFactory("Badge");
      let badge = await Badge.deploy();
      await badge.deployed();
      console.log("badge deployed to:", badge.address);

      await badge.mint(otherAccount.address, owner.address)
      console.log('owner', await badge.ownerOf(1))
      console.log('uri', await badge.tokenURI(1))

      await badge.mintBatch([otherAccount.address], [owner.address])
      console.log('owner', await badge.ownerOf(2))

      await badge.mintWithId([otherAccount.address], [owner.address], [100])
      console.log('owner', await badge.ownerOf(100))

      // await badge.transferFrom(otherAccount.address, owner.address, 1)
      // console.log('owner', await badge.ownerOf(1))
    });
  });
});
