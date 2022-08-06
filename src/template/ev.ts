import { formatSubjectAltName, optional } from "./format"

type args = {
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
    businessCategory: string,
    postalCode: string,
    streetAddress: string
}

export const render = (
    { commonName,
        altName,
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName,
        jurisdictionLocalityName,
        jurisdictionStateOrProvinceName,
        jurisdictionCountryName,
        serialNumber,
        businessCategory,
        postalCode,
        streetAddress,
    }: args
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
${optional("postalCode", postalCode)}
${optional("streetAddress", streetAddress)}
[ v3_req ]
subjectAltName = ${formatSubjectAltName(commonName)}`
    altName.forEach(item => template += `,${formatSubjectAltName(item)}`)
    return template
}