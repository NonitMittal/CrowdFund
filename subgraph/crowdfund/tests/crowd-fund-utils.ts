import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CampaignCreated,
  CampaignDeleted,
  ContributionMade,
  RefundMade
} from "../generated/CrowdFund/CrowdFund"

export function createCampaignCreatedEvent(
  campaignId: BigInt,
  campaignCreator: Address,
  title: string,
  description: string,
  imageURI: string,
  goal: BigInt,
  startsAt: BigInt,
  endsAt: BigInt,
  status: i32
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignCreator",
      ethereum.Value.fromAddress(campaignCreator)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("imageURI", ethereum.Value.fromString(imageURI))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("goal", ethereum.Value.fromUnsignedBigInt(goal))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startsAt",
      ethereum.Value.fromUnsignedBigInt(startsAt)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("endsAt", ethereum.Value.fromUnsignedBigInt(endsAt))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return campaignCreatedEvent
}

export function createCampaignDeletedEvent(
  campaignId: BigInt,
  campaignCreator: Address,
  status: i32
): CampaignDeleted {
  let campaignDeletedEvent = changetype<CampaignDeleted>(newMockEvent())

  campaignDeletedEvent.parameters = new Array()

  campaignDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  campaignDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignCreator",
      ethereum.Value.fromAddress(campaignCreator)
    )
  )
  campaignDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return campaignDeletedEvent
}

export function createContributionMadeEvent(
  campaignId: BigInt,
  contributor: Address,
  amount: BigInt
): ContributionMade {
  let contributionMadeEvent = changetype<ContributionMade>(newMockEvent())

  contributionMadeEvent.parameters = new Array()

  contributionMadeEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  contributionMadeEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )
  contributionMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return contributionMadeEvent
}

export function createRefundMadeEvent(
  campaignId: BigInt,
  contributor: Address,
  amount: BigInt
): RefundMade {
  let refundMadeEvent = changetype<RefundMade>(newMockEvent())

  refundMadeEvent.parameters = new Array()

  refundMadeEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  refundMadeEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )
  refundMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return refundMadeEvent
}
