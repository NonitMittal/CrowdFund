import {
  CampaignCreated as CampaignCreatedEvent,
  CampaignDeleted as CampaignDeletedEvent,
  ContributionMade as ContributionMadeEvent,
  RefundMade as RefundMadeEvent
} from "../generated/Contract/Contract";
import { Campaign, CampaignMetadata, Stats } from "../generated/schema";
import { BigInt } from '@graphprotocol/graph-ts'

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  const id = event.params.campaignId.toHex() + event.address.toHex();
  let campaign = new Campaign(id);
  if(!campaign){
    campaign = new Campaign(id);
    campaign.campaignId = event.params.campaignId;
    campaign.creator = event.params.campaignCreator;
    campaign.address = event.address;
    campaign.goal = event.params.goal;
    campaign.createdAt = event.block.timestamp;
    campaign.startsAt = event.params.startsAt;
    campaign.endsAt = event.params.endsAt;
    campaign.status = handleStatus(event.params.status as u32);
    campaign.totalContributions = BigInt.fromString("0");

    let metadata = new CampaignMetadata(id);
    if(!metadata){
      metadata = new CampaignMetadata(id);
      metadata.title = event.params.title;
      metadata.description = event.params.description;
      metadata.imageURI = event.params.imageURI;
      metadata.save();
    }
    campaign.metadata = metadata.id;
    campaign.save();
  }
}

export function handleContributionMade(event: ContributionMadeEvent): void {
  const id = event.params.campaignId.toHex() + event.address.toHex();
  let campaign = new Campaign(id);
  if(campaign){
    campaign.totalContributions = campaign.totalContributions.plus(event.params.amount);

    const statsId = event.params.campaignId.toHex() + event.transaction.hash.toHex();
    let stats = new Stats(statsId);
    if(!stats){
      stats = new Stats(statsId);
      stats.userAddress = event.params.contributor;
      stats.amount = event.params.amount;
      stats.txnHash = event.transaction.hash;
      stats.type = "CONTRIBUTION";
      stats.save();
    }

    let tempStats = campaign.contributions;
    if(!tempStats){
      tempStats = [];
    }
    tempStats.push(statsId);
    campaign.contributions = tempStats;
    campaign.save();
  }
}

export function handleCampaignDeleted(event: CampaignDeletedEvent): void {
  const id = event.params.campaignId.toHex() + event.address.toHex();
  let campaign = new Campaign(id);
  if(campaign){
    campaign.status = handleStatus(event.params.status as u32);
    campaign.save();
  }
}


export function handleRefundMade(event: RefundMadeEvent): void {
  const id = event.params.campaignId.toHex() + event.address.toHex();
  let campaign = new Campaign(id);
  if(campaign){
    campaign.totalContributions = campaign.totalContributions.minus(event.params.amount);

    const statsId = event.params.campaignId.toHex() + event.transaction.hash.toHex();
    let stats = new Stats(statsId);
    if(!stats){
      stats = new Stats(statsId);
      stats.userAddress = event.params.contributor;
      stats.amount = event.params.amount;
      stats.txnHash = event.transaction.hash;
      stats.type = "REFUND";
      stats.save();
    }

    let tempStats = campaign.refunds;
    if(!tempStats){
      tempStats = [];
    }
    tempStats.push(statsId);
    campaign.refunds = tempStats;
    campaign.save();
  }
}

function handleStatus(statusFromChain: u32): string {
  switch (statusFromChain) {
    case 0:
      return "ACTIVE";
    case 1:
      return "DELETED";
    case 2:
      return "SUCCESSFUL";
    case 3:
      return "UNSUCCEEDED";
    default:
      return "";
  }
}