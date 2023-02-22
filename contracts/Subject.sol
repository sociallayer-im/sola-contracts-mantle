// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./Org.sol";

contract Subject is ERC721Upgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    address ORG_ADDR;

    function initialize(address orgAddr) public initializer {
        ERC721Upgradeable.__ERC721_init("Subject", "Subject");
        OwnableUpgradeable.__Ownable_init();
        ORG_ADDR = orgAddr;
    }

    mapping(uint256 => mapping(uint256 => bool)) internal org_subjects;

    function mint(uint256 orgId) public {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(_msgSender(), tokenId);

        if (orgId != 0x0) {
            require(Org(ORG_ADDR).isApprovedOrOwner(_msgSender(), orgId), "not owner or approved of org");
            org_subjects[orgId][tokenId] = true;
            // emit org, tokenId
        }
    }
}
