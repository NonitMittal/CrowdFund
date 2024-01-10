// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract CrowdFund {
    //VARIABLES----------------------------------------------------------------
    uint private nextId = 0;
    Campaign[] public campaigns;

    //STRUCTS------------------------------------------------------------------
    struct Campaign {
        uint id;
        address campaignCreator;
        uint startsAt;
        uint endsAt;
        uint goal;
        STATUS status;
        uint totalContributions;
        address[] contributors;
        uint[] contributionAmounts;
    }

    enum STATUS {
        ACTIVE,
        DELETED,
        SUCCESSFUL,
        UNSUCCEEDED
    }

    //EVENTS-------------------------------------------------------------------
    event CampaignCreated(
        uint indexed campaignId,
        address campaignCreator,
        string title,
        string description,
        string imageURI,
        uint goal,
        uint startsAt,
        uint endsAt,
        STATUS status
    );
    event ContributionMade(uint indexed campaignId, address contributor, uint amount);
    event CampaignDeleted(uint indexed campaignId, address campaignCreator, STATUS status);
    event RefundMade(uint indexed campaignId,  address contributor, uint amount);

    //FUNCTIONS----------------------------------------------------------------
    // Function to create a new crowdfunding campaign
    function createCampaign(
        string memory title,
        string memory description,
        string memory imageURI,
        uint goal,
        uint endsAt
    ) public {
        require(bytes(title).length > 0, "Title must not be empty");
        require(bytes(description).length > 0, "Description must not be empty");
        require(bytes(imageURI).length > 0, "Image URI must not be empty");
        require(goal > 0, "Goal must be greater than zero");
        require(
            endsAt > block.timestamp,
            "Ends time must be greater than the current time"
        );

        campaigns.push(
            Campaign(
                nextId,
                msg.sender,
                block.timestamp,
                endsAt,
                goal,
                STATUS.ACTIVE,
                0,
                new address[](0),
                new uint[](0)
            )
        );

        emit CampaignCreated(
            nextId,
            msg.sender,
            title,
            description,
            imageURI,
            goal,
            block.timestamp,
            endsAt,
            STATUS.ACTIVE
        );
        nextId++;
    }

    // Function to allow contributors to contribute funds to a campaign
    function contribute(uint campaignId) public payable {
        require(campaignId < nextId, "Campaign does not exist.");

        Campaign storage campaign = campaigns[campaignId];

        require(msg.value > 0, "Contribution amount must be greater than zero.");
        require(block.timestamp < campaign.endsAt, "Campaign has ended.");

        if(campaign.status == STATUS.DELETED){
            revert("Campaign has been deleted.");
        }
        if(campaign.status == STATUS.SUCCESSFUL){
            revert("Campaign was successful. Can't contribute.");
        }
        require(campaign.status == STATUS.ACTIVE, "Campaign is not active.");

        uint remainingFundsNeeded = campaign.goal - campaign.totalContributions;
        uint contributedAmount = 0;

        if (msg.value <= remainingFundsNeeded) {
            contributedAmount = msg.value;
        } else {
            uint excessAmount = msg.value - remainingFundsNeeded;
            contributedAmount = msg.value - excessAmount;
            payable(msg.sender).transfer(excessAmount);
        }
        campaign.totalContributions += contributedAmount;

        if (campaign.totalContributions >= campaign.goal && block.timestamp <= campaign.endsAt) {
            campaign.status = STATUS.SUCCESSFUL;
        }
        if (campaign.totalContributions < campaign.goal && block.timestamp >= campaign.endsAt){
            campaign.status = STATUS.UNSUCCEEDED;
        }

        campaign.contributors.push(msg.sender);
        campaign.contributionAmounts.push(contributedAmount);
        emit ContributionMade(campaignId, msg.sender, contributedAmount);
    }

    // Function to allow contributors to withdraw their contributions
    function withdrawContribution(uint campaignId) public {
        require(campaignId < nextId, "Campaign does not exist.");

        Campaign storage campaign = campaigns[campaignId];

        require(campaign.status != STATUS.SUCCESSFUL, "Campaign was successful. Can't Withdraw.");
        require(campaign.totalContributions > 0, "Campaign has no contributions.");
        require(block.timestamp < campaign.endsAt, "Campaign has ended. Can't Withdraw.");

        for (uint i = 0; i < campaign.contributors.length; i++) {
            if (campaign.contributors[i] == msg.sender) {
                uint contributionAmount = campaign.contributionAmounts[i];
                campaign.contributionAmounts[i] = 0;
                campaign.contributors[i] = address(0);
                campaign.totalContributions -= contributionAmount;
                payable(msg.sender).transfer(contributionAmount);
                emit RefundMade(campaignId, msg.sender, contributionAmount);
            }
        }
    }

    // Function to allow the campaign creator to delete a campaign
    function deleteCampaign(uint campaignId) public {
        require(campaignId < nextId, "Campaign does not exist.");

        Campaign storage campaign = campaigns[campaignId];
        require(campaign.campaignCreator == msg.sender);
        
        refund(campaignId);
        campaign.status = STATUS.DELETED;
        emit CampaignDeleted(campaignId, msg.sender, STATUS.DELETED);
    }

    // Internal function to refund contributions when a campaign is deleted
    function refund(uint campaignId) internal {
        Campaign storage campaign = campaigns[campaignId];

        for (uint i = 0; i < campaign.contributors.length; i++) {
            address contributor = campaign.contributors[i];
            uint contributionAmount = campaign.contributionAmounts[i];
            payable(contributor).transfer(contributionAmount);
            campaign.totalContributions -= contributionAmount;

            emit RefundMade(campaignId, contributor, contributionAmount);
        }
    }
}
