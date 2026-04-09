// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract DailyCheckInTest is Test {
    DailyCheckIn internal c;
    address internal alice = address(0xA11ce);

    function setUp() public {
        c = new DailyCheckIn();
    }

    function test_CheckIn_EmitsAndSetsDay() public {
        vm.startPrank(alice);
        uint256 day = block.timestamp / 1 days;
        vm.expectEmit(true, false, false, true);
        emit DailyCheckIn.CheckedIn(alice, day);
        c.checkIn();
        assertEq(c.lastCheckInDay(alice), day);
        vm.stopPrank();
    }

    function test_RevertWhen_DoubleSameDay() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.expectRevert(DailyCheckIn.AlreadyToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_AllowNextDay() public {
        vm.startPrank(alice);
        c.checkIn();
        uint256 next = block.timestamp + 1 days;
        vm.warp(next);
        c.checkIn();
        assertEq(c.lastCheckInDay(alice), next / 1 days);
        vm.stopPrank();
    }

    function test_RevertWhen_ValueSent() public {
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        vm.expectRevert(bytes("NO_VALUE"));
        c.checkIn{value: 1 wei}();
        vm.stopPrank();
    }
}
