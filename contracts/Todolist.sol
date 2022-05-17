// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

contract Todolist {
    struct Account {
        address writer;
        string[] ipfsHash;
    }

    mapping(address => Account) accounts;

    function addHash(string memory newHash) public {
        accounts[msg.sender].writer = msg.sender;
        accounts[msg.sender].ipfsHash.push(newHash);
    }

    function getLastHash() public view returns(string memory) {
        string[] memory arrHash = accounts[msg.sender].ipfsHash;
        if (arrHash.length == 0) return "No hash added";
        return arrHash[arrHash.length - 1];
    }

    function getAllHash() public view returns(string[] memory) {
        return accounts[msg.sender].ipfsHash;
    }
}