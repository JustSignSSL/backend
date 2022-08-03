import { CAdir } from "./util/file"
import { join } from "path"
import { config, CAType } from './util/type'
import { readFileSync } from "fs"
import { projDir } from "./util/file"

const cnfDir = (name: string) => join(CAdir, name, 'powerca.cnf')

const filter = (config: config[]): config[] => {
    config.forEach(item => item.path = cnfDir(item.path).replace("//", "/"))
    return config
}

const list: config[] = JSON.parse(readFileSync(join(projDir, "src", "config.json")).toString())

export default filter(list)

export const getValidCA = (type: CAType): string[] => {
    const filter = list.filter(item => item.CAType === type)
    const result: string[] = []
    filter.forEach(item => result.push(item.name))
    return result
}