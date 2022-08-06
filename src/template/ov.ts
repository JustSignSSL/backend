import { formatSubjectAltName } from "./format"

type args = {
    commonName: string,
    altName: Array<string>,
    countryName: string,
    stateOrProvinceName: string,
    localityName: string,
    organizationName: string
}

export const render = (
    { commonName,
        altName,
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName
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
commonName = ${commonName}
[ v3_req ]
subjectAltName = ${formatSubjectAltName(commonName)}`
    altName.forEach(item => template += `,${formatSubjectAltName(item)}`)
    return template
}