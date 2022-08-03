import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export const projDir = join(__dirname, '..', '..')
export const tmpDir = join(projDir, 'tmp')
export const CAdir = join(projDir, 'CA')

export const write = (content: string, path: string, name: string) => {
    if (!existsSync(path)) mkdirSync(path)
    writeFileSync(join(path, name), content)
}