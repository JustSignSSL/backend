import { join } from "path";

export default (...args: string[]) => join(...args).replace("\\", "/")