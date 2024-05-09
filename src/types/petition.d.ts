type PetitionList = {
    petitionId: number,
    title: string,
    categoryId: number,
    creationDate: string,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    supportingCost: number
    category: string
}

type SupportTier = {
    supportTierId: number;
    title: string;
    description: string;
    cost: number;
}

type Petition = {
    petitionId: number,
    title: string,
    creationDate: string,
    title: string,
    description: string,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    moneyRaised: number,
    ownerId: number,
    categoryId: number,
    supportTiers: SupportTier[]
}

type SupporterList = {
    supportId: number,
    supportTierId: number,
    message: string,
    supporterId: number,
    supporterFirstName: string,
    supporterLastName: string,
    timestamp: string,
    tierTitle: string
}