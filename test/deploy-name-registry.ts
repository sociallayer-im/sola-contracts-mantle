import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { keccak_256 } from "js-sha3";

export function sha3(data: string) {
  return "0x" + keccak_256(data);
}

export function getNamehash(name: string) {
  let node = "0000000000000000000000000000000000000000000000000000000000000000";

  if (name) {
    let labels = name.split(".");

    for (let i = labels.length - 1; i >= 0; i--) {
      let labelSha = keccak_256(labels[i]);
      node = keccak_256(Buffer.from(node + labelSha, "hex"));
    }
  }

  return "0x" + node;
}

describe("NameRegistry", function () {

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const NameRegistry = await ethers.getContractFactory("NameRegistry");
      let registry = await upgrades.deployProxy(NameRegistry, [getNamehash("sola.day")]);
      await registry.deployed();
      console.log("registry deployed to:", registry.address);

      await registry.nameRegister("solaris", owner.address)
      console.log('owner', await registry.ownerOf(getNamehash("solaris.sola.day")))

      await registry.mintSubdomain(owner.address, getNamehash("solaris.sola.day"), "open")
      console.log('owner', await registry.ownerOf(getNamehash("open.solaris.sola.day")))
    });
  });
});
