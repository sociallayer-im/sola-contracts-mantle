// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

contract BadgeUpgradeable is ERC721Upgradeable, OwnableUpgradeable {
    uint256 _counter; // default: 0

    using StringsUpgradeable for uint256;

    error URIQueryForNonexistentToken();

    string public baseURI;

    struct Record {
        address issuer;
        address receiver;
    }

    mapping(uint256 => Record) internal records;

    function initialize(string memory _baseURI) public initializer {
        ERC721Upgradeable.__ERC721_init("Badge", "Badge");
        OwnableUpgradeable.__Ownable_init();
        baseURI = _baseURI;
    }

    function setCounter(uint256 value) public onlyOwner returns (uint256) {
        return _counter = value;
    }

    function current() public view returns (uint256) {
        return _counter;
    }

    function increment() internal {
        unchecked {
            _counter += 1;
        }
    }

    function decrement() internal {
        uint256 value = _counter;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            _counter = value - 1;
        }
    }

    function setTokenURI(string memory _baseURI) onlyOwner external {
        baseURI = _baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : '';
    }

    function exists(uint256 tokenId) public view virtual returns (bool) {
        return _exists(tokenId);
    }

    function mintWithId(address[] calldata receivers, address[] calldata issuers, uint256[] calldata ids) onlyOwner external {
        require(receivers.length == issuers.length && receivers.length == ids.length, "invalid data");

        for (uint256 i = 0; i < receivers.length; i+=1) {
            uint256 tokenId = ids[i];

            records[tokenId].issuer = issuers[i];
            records[tokenId].receiver = receivers[i];
            _mint(receivers[i], tokenId);
        }
    }

    function mintBatch(address[] calldata receivers, address[] calldata issuers) onlyOwner external {
        require(receivers.length == issuers.length, "invalid data");

        for (uint256 i = 0; i < receivers.length; i+=1) {
            increment();
            uint256 tokenId = current();

            records[tokenId].issuer = issuers[i];
            records[tokenId].receiver = receivers[i];
            _mint(receivers[i], tokenId);
        }
    }

    function mint(address receiver, address issuer) onlyOwner public {
        increment();
        uint256 tokenId = current();

        records[tokenId].issuer = issuer;
        records[tokenId].receiver = receiver;
        _mint(receiver, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(from == address(0) || to == address(0) || _msgSender() == owner(), "not transferrable");
    }
}
