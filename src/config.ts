import { CAdir } from "./util/file"
import { join } from "path"
import { CA, CAType, config } from './util/type'
import { readFileSync } from "fs"
import { projDir } from "./util/file"

const cnfDir = (name: string) => join(CAdir, name, 'powerca.cnf')

const filter = (config: CA[]): CA[] => {
    config.forEach(item => item.path = cnfDir(item.path).replace("//", "/"))
    return config
}

const config: config = JSON.parse(readFileSync(join(projDir, "src", "config.json")).toString())

export const isDev = config.debug

export const origin = config.origin

const list: CA[] = config.CA

export const port = config.port

export default filter(list)

export const getValidCA = (type: CAType): string[] => {
    const filter = list.filter(item => item.CAType === type)
    const result: string[] = []
    filter.forEach(item => result.push(item.name))
    return result
}