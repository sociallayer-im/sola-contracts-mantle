// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";


contract Org is ERC721Upgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    function initialize() public initializer {
        ERC721Upgradeable.__ERC721_init("Org", "Org");
        OwnableUpgradeable.__Ownable_init();
    }

    function mint() public {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(_msgSender(), tokenId);
    }

    function isApprovedOrOwner(address addr, uint256 tokenId) public view returns(bool) {
        return _isApprovedOrOwner(addr, tokenId);
    }

    mapping(uint256 => mapping(address => bool)) internal members;

    function setMamber(uint256 org, address member, bool value) public onlyOwner {
        require(owner() == _msgSender() || _isApprovedOrOwner(_msgSender(), org), "not owner nor approved");

        members[org][member] = value;
        // emit org, member, value
    }

    function isMamber(uint256 org, address member) public view returns (bool) {
        require(owner() == _msgSender() || _isApprovedOrOwner(_msgSender(), org), "not owner nor approved");

        return members[org][member];
    }
}
