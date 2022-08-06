import { pick } from 'lodash'
import { getValidCA } from './config'
import joi from 'joi'
import { output, info } from './util/type'
import ISO3166 from './util/ISO3166'

const DVSchema = {
    validationLevel: joi.any().required(),
    commonName: [
        joi.string().domain().required(),
        joi.string().ip({ version: ['ipv4', 'ipv6'] }).required(),
        joi.string().regex(/^(?=^.{3,255}$)\*\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/)
    ],
    CAName: joi.string().valid(...getValidCA("DV")).required(),
    validityPeriod: joi.number().valid(7, 14, 30, 90, 180, 365, 396).required(),
    signatureHashingAlgorithm: joi.any().allow("SHA256", "SHA384", "SHA512").required(),
    altName: joi.array().items(
        joi.string().domain(),
        joi.string().ip({ version: ['ipv4', 'ipv6'] }),
        joi.string().regex(/^(?=^.{3,255}$)\*\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/)
    )
}

const OVSchema = Object.assign({}, DVSchema, {
    countryName: joi.string().valid(...ISO3166).required(),
    stateOrProvinceName: joi.string().max(30).required(),
    localityName: joi.string().max(30).required(),
    organizationName: joi.string().max(30).required(),
    CAName: joi.string().valid(...getValidCA("OV")).required(),
})

const EVSchema = Object.assign({}, OVSchema, {
    serialNumber: joi.string().regex(/^[A-Z\d]+$/),
    businessCategory: joi.string().valid("Private Organization", "Government Entity").required(),
    jurisdictionLocalityName: [joi.string().max(30), joi.string().allow("")],
    jurisdictionStateOrProvinceName: [joi.string().max(30), joi.string().allow("")],
    jurisdictionCountryName: joi.string().valid(...ISO3166).required(),
    CAName: joi.string().valid(...getValidCA("EV")).required(),
    commonName: [
        joi.string().domain().required(),
        joi.string().ip({ version: ['ipv4', 'ipv6'] }).required(),
    ],
    altName: joi.array().items(
        joi.string().domain(),
        joi.string().ip({ version: ['ipv4', 'ipv6'] }),
    ),
    postalCode: [joi.string(), joi.number(), joi.string().allow("")],
    streetAddress: [joi.string(),joi.string().allow("")]
})

const schemaList = {
    DV: joi.object(DVSchema),
    OV: joi.object(OVSchema),
    EV: joi.object(EVSchema)
}

let infoMap = {
    "DV": ['validationLevel', 'commonName', 'CAName', 'validityPeriod', 'signatureHashingAlgorithm', 'altName'],
    "OV": ['validationLevel', 'commonName', 'CAName', 'validityPeriod', 'signatureHashingAlgorithm', 'altName',
        'countryName', 'stateOrProvinceName', 'localityName', 'organizationName'],
    "EV": ['validationLevel', 'commonName', 'CAName', 'validityPeriod', 'signatureHashingAlgorithm', 'altName',
        'countryName', 'stateOrProvinceName', 'localityName', 'organizationName',
        'serialNumber', 'businessCategory', 'jurisdictionLocalityName', 'jurisdictionStateOrProvinceName',
        'jurisdictionCountryName', 'postalCode', 'streetAddress'],
}

export default function (obj: Partial<info>): output {
    if (obj.validationLevel) {
        const data = pick(obj, infoMap[obj.validationLevel])
        const { error, value } = schemaList[obj.validationLevel].validate(data)
        if (error) return error.message
        return value
    } else {
        return 'validationLevel undefined'
    }
}