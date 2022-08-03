import { info } from "./util/type";
import { exec } from 'shelljs'
import { render as DVTemplate } from './template/dv'
import { render as OVTemplate } from './template/ov'
import { render as EVTemplate } from './template/ev'
import { write, tmpDir } from "./util/file";
import random from "./util/random";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, rmSync } from "fs";
import config from "./config";

export function generate(info: info) {
    const sign = random()
    const generateDir = join(tmpDir, sign)
    if (!existsSync(generateDir)) mkdirSync(generateDir)
    try {
        switch (info.validationLevel) {
            case "DV":
                write(DVTemplate(info.commonName, info.altName), generateDir, "config.cnf")
                break;
            case "OV":
                write(OVTemplate(info.commonName, info.altName, info.countryName!,
                    info.stateOrProvinceName!, info.localityName!, info.organizationName!),
                    generateDir, "config.cnf")
                break;
            case "EV":
                write(EVTemplate(info.commonName, info.altName, info.countryName!,
                    info.stateOrProvinceName!, info.localityName!, info.organizationName!,
                    info.jurisdictionLocalityName!, info.jurisdictionStateOrProvinceName!,
                    info.jurisdictionCountryName!, info.serialNumber!, info.businessCategory!), generateDir, "config.cnf")
                break;
        }
        const configCnfDir = join(generateDir, "config.cnf")
        const keyPemDir = join(generateDir, "key.pem")
        exec(["openssl", "genrsa", "-out", keyPemDir, "2048"].join(" "), { silent: true })
        const csrPemdir = join(generateDir, "csr.pem")
        exec(`openssl req -config ${configCnfDir} -key ${keyPemDir} -new -utf8 ${"-" + info.signatureHashingAlgorithm.toLowerCase()} -out ${csrPemdir}`, { silent: true })
        const CACnfDir = config.filter(item => item.name === info.CAName)[0].path
        const certPemDir = join(generateDir, "cert.pem")
        exec(["openssl", "ca", "-config", CACnfDir, "-extensions", "server_cert", "-days",
            info.validityPeriod, "-notext", "-utf8", "-md",
            info.signatureHashingAlgorithm.toLowerCase(), "-in", csrPemdir, "-out", certPemDir, "-batch"].join(" "), { silent: true })
        const powerCaCertPemDir = join(CACnfDir.replace("powerca.cnf", ""), "certs", "powerca.cert.pem")
        const certPem = readFileSync(certPemDir).toString()
        const keyPem = readFileSync(keyPemDir).toString()
        const powerCaCertPem = readFileSync(powerCaCertPemDir).toString()
        return {
            certPem,
            keyPem,
            powerCaCertPem
        }
    } catch (_) {
        return "Unknown Error"
    } finally {
        if (existsSync(generateDir)) rmSync(generateDir, { recursive: true })
    }
}