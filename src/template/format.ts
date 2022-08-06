import { isV4Format, isV6Format } from "ip"

export const formatSubjectAltName = (str: string) => isV4Format(str) || isV6Format(str) ? `IP:${str}` : `DNS:${str}`

export const optional = (key: string, value: string) => {
    if (value === '') return ''
    return `${key} = ${value}`
}