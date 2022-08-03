import { formatSubjectAltName } from "./format"

export const render = (
    commonName: string,
    altName: Array<string>,
    countryName: string,
    stateOrProvinceName: string,
    localityName: string,
    organizationName: string,
    jurisdictionLocalityName: string,
    jurisdictionStateOrProvinceName: string,
    jurisdictionCountryName: string,
    serialNumber: string,
    businessCategory: string
) => {
    let template = `[ req ]
prompt = no
default_bits = 2048
distinguished_name = req_distinguished_name
string_mask = utf8only
default_md = sha256
req_extensions = v3_req
[ req_distinguished_name ]
countryName = ${countryName}
stateOrProvinceName = ${stateOrProvinceName}
localityName = ${localityName}
organizationName = ${organizationName}
serialNumber = ${serialNumber}
commonName = ${commonName}
businessCategory = ${businessCategory}
jurisdictionLocalityName = ${jurisdictionLocalityName}
jurisdictionStateOrProvinceName = ${jurisdictionStateOrProvinceName}
jurisdictionCountryName = ${jurisdictionCountryName}
[ v3_req ]
subjectAltName = ${formatSubjectAltName(commonName)}`
    altName.forEach(item => template += `,${formatSubjectAltName(item)}`)
    return template
}