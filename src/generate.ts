import { CAType, info } from "./util/type";
import exec from "./util/exec";
import { render as DVTemplate } from './template/dv'
import { render as OVTemplate } from './template/ov'
import { render as EVTemplate } from './template/ev'
import { write, tmpDir } from "./util/file";
import random from "./util/random";
import join from "./util/join";
import { existsSync } from "fs";
import { mkdir, readFile, rm } from "fs/promises";
import config, { isDev } from "./config";

const getTemplate = (type: CAType) => {
    let map = {
        "DV": DVTemplate,
        "OV": OVTemplate,
        "EV": EVTemplate
    }
    return map[type]
}


export async function generate(info: info) {
    const sign = random()
    const generateDir = join(tmpDir, sign)
    if (!existsSync(generateDir)) await mkdir(generateDir)
    try {
        write(getTemplate(info.validationLevel)(info as any), generateDir, "config.cnf")
        const configCnfDir = join(generateDir, "config.cnf")
        const keyPemDir = join(generateDir, "key.pem")
        await exec("openssl", ["genrsa", "-out", keyPemDir, "2048"])
        const csrPemdir = join(generateDir, "csr.pem")
        await exec("openssl", ["req", "-config", configCnfDir, "-key", keyPemDir, "-new", "-utf8", "-" + info.signatureHashingAlgorithm.toLowerCase(), "-out", csrPemdir])
        const CACnfDir = config.filter(item => item.name === info.CAName)[0].path
        const certPemDir = join(generateDir, "cert.pem")
        await exec("openssl", ["ca", "-config", CACnfDir, "-extensions", "server_cert", "-days",
            info.validityPeriod, "-notext", "-utf8", "-md",
            info.signatureHashingAlgorithm.toLowerCase(), "-in", csrPemdir, "-out", certPemDir, "-batch"])
        const powerCaCertPemDir = join(CACnfDir.replace("powerca.cnf", ""), "certs", "powerca.cert.pem")
        const certPem = (await readFile(certPemDir)).toString()
        const keyPem = (await readFile(keyPemDir)).toString()
        const powerCaCertPem = (await readFile(powerCaCertPemDir)).toString()
        return {
            certPem,
            keyPem,
            powerCaCertPem
        }
    } catch (e) {
        console.log(e)
        return "Unknown Error"
    } finally {
        if (existsSync(generateDir) && !isDev) await rm(generateDir, { recursive: true })
    }
}