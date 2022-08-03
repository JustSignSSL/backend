import { IOS3166 } from "./ISO3166"
export type businessCategory = "Private Organization" | "Government Entity"
export type validityPeriod = '7' | '14' | '30' | '90' | '180' | '365' | '396'
export type signatureHashingAlgorithm = "SHA256" | "SHA384" | "SHA512"
export interface CA {
    name: string,
    CAType: CAType,
    path: string
}
export type CAType = 'DV' | 'OV' | 'EV'

export type output = string | info
export interface info {
    validationLevel: CAType
    commonName: string,
    CAName: string,
    validityPeriod: validityPeriod,
    signatureHashingAlgorithm: string,
    altName: string[]
    countryName?: IOS3166
    stateOrProvinceName?: string
    localityName?: string
    organizationName?: string
    serialNumber?: string
    businessCategory?: businessCategory
    jurisdictionLocalityName?: string
    jurisdictionStateOrProvinceName?: string
    jurisdictionCountryName?: string
}

export type config = {
    debug: boolean,
    CA: CA[]
}