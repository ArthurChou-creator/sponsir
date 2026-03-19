// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SponsorshipRegistry
 * @notice Records sponsorship purchases onchain on X Layer.
 *         Each purchase emits an event and is stored for retrieval.
 */
contract SponsorshipRegistry {

    struct Sponsorship {
        address sponsor;
        string  eventId;
        string  planId;
        string  eventTitle;
        string  planTitle;
        uint256 amount;      // in wei (USDC uses 6 decimals, but we store raw)
        uint256 timestamp;
    }

    // All sponsorships ever recorded
    Sponsorship[] public sponsorships;

    // sponsor address → list of sponsorship indices
    mapping(address => uint256[]) private _bySponsor;

    event SponsorshipRecorded(
        uint256 indexed id,
        address indexed sponsor,
        string  eventId,
        string  planId,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @notice Record a sponsorship purchase.
     *         Call this after payment is confirmed.
     */
    function record(
        string calldata eventId,
        string calldata planId,
        string calldata eventTitle,
        string calldata planTitle,
        uint256 amount
    ) external returns (uint256 id) {
        id = sponsorships.length;
        sponsorships.push(Sponsorship({
            sponsor:    msg.sender,
            eventId:    eventId,
            planId:     planId,
            eventTitle: eventTitle,
            planTitle:  planTitle,
            amount:     amount,
            timestamp:  block.timestamp
        }));
        _bySponsor[msg.sender].push(id);
        emit SponsorshipRecorded(id, msg.sender, eventId, planId, amount, block.timestamp);
    }

    /// @notice Total number of sponsorships recorded
    function totalSponsorships() external view returns (uint256) {
        return sponsorships.length;
    }

    /// @notice Get all sponsorship IDs for a given sponsor
    function getSponsorshipIds(address sponsor) external view returns (uint256[] memory) {
        return _bySponsor[sponsor];
    }

    /// @notice Get full details for a sponsorship by ID
    function getSponsorship(uint256 id) external view returns (Sponsorship memory) {
        require(id < sponsorships.length, "Not found");
        return sponsorships[id];
    }
}
