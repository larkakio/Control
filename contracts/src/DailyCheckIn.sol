// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice One check-in per address per UTC-aligned day bucket (`block.timestamp / 1 days`).
/// @dev Storage stores `day + 1` so day `0` is distinguishable from "never checked".
contract DailyCheckIn {
    mapping(address => uint256) private _lastStored;

    event CheckedIn(address indexed user, uint256 day);

    /// @return The last calendar day index checked in, or 0 if never.
    function lastCheckInDay(address user) external view returns (uint256) {
        uint256 s = _lastStored[user];
        return s == 0 ? 0 : s - 1;
    }

    function checkIn() external payable {
        require(msg.value == 0, "NO_VALUE");
        uint256 day = block.timestamp / 1 days;
        uint256 s = _lastStored[msg.sender];
        if (s != 0 && s - 1 == day) revert AlreadyToday();
        _lastStored[msg.sender] = day + 1;
        emit CheckedIn(msg.sender, day);
    }

    error AlreadyToday();
}
