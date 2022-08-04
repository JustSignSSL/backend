import execa from "execa";
import { isDev } from "../config";

export default async (command: string, args: string[]) => {
    if (isDev) {
        const { stdout, stderr } = await execa(command, args)
        console.log(stdout)
        console.error(stderr)
    } else {
        await execa(command, args)
    }
}