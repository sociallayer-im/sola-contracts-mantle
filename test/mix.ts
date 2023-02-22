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

describe("Mix", function () {

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const [one, two] = await ethers.getSigners();

      // register identity

      const NameRegistry = await ethers.getContractFactory("NameRegistry");
      let registry = await upgrades.deployProxy(NameRegistry, [getNamehash("sola")]);
      await registry.deployed();
      console.log("registry deployed to:", registry.address);

      await registry.nameRegister("solaris", one.address)
      console.log('owner', await registry.ownerOf(getNamehash("solaris.sola")))

      await registry.mintSubdomain(one.address, getNamehash("solaris.sola"), "open")
      console.log('owner', await registry.ownerOf(getNamehash("open.solaris.sola")))

      // create org

      const Org = await ethers.getContractFactory("Org");
      let org = await upgrades.deployProxy(Org, []);
      await org.deployed();
      console.log("org deployed to:", org.address);

      await org.mint()
      console.log('balance one', await org.ownerOf(1))

      console.log(await org.isMamber(1, one.address))

      await org.setMamber(1, one.address, true)
      await org.setMamber(1, two.address, true)

      console.log(await org.isMamber(1, one.address))

      // create template

      const BadgeTemplate = await ethers.getContractFactory("BadgeTemplate");
      let template = await upgrades.deployProxy(BadgeTemplate, []);
      await template.deployed();
      console.log("template deployed to:", template.address);

      await template.mint()
      console.log('one', await template.ownerOf(1))

      // create subject

      const Subject = await ethers.getContractFactory("Subject");
      let subject = await upgrades.deployProxy(Subject, [org.address]);
      await subject.deployed();
      console.log("subject deployed to:", subject.address);

      await subject.mint(0)
      console.log('one', await subject.ownerOf(1))

      // create badge

      const Badge = await ethers.getContractFactory("Badge");
      let badge = await upgrades.deployProxy(Badge, [org.address]);
      await badge.deployed();
      console.log("badge deployed to:", badge.address);

      await badge.mint(one.address, two.address, 0, 0, 0)
      console.log('balance one', await badge.ownerOf(1))

      await badge.transferFrom(one.address, two.address, 1)
      console.log('balance one', await badge.ownerOf(1))

      await badge.mint(one.address, two.address, 1, 1, 0)
      console.log('balance one', await badge.ownerOf(1))

      // create org subject

      await subject.mint(1)
      console.log('one', await subject.ownerOf(2))

      // create org badge

      await badge.mint(one.address, two.address, 1, 1, 1)
      console.log('balance one', await badge.ownerOf(1))

    });
  });
});
