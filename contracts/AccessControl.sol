// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessControl is Ownable {
    mapping(address => bool) private _admins;

    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);

    constructor() {
        _admins[_msgSender()] = true;
    }

    modifier onlyAdmin() {
        require(_admins[_msgSender()], "AccessControl: !admin");
        _;
    }

    function addAdmin(address _account) external onlyOwner {
        require(_account != address(0), "AccessControl: !zeroAddress");
        _admins[_account] = true;
        emit AdminAdded(_account);
    }

    function removeAdmin(address _account) external onlyOwner {
        require(_account != address(0), "AccessControl: !zeroAddress");
        _admins[_account] = false;
        emit AdminRemoved(_account);
    }

    function renounceAdminship() external onlyAdmin {
        _admins[_msgSender()] = false;
        emit AdminRemoved(_msgSender());
    }

    function isAdmin(address _account) public view returns (bool) {
        return _admins[_account];
    }
}
