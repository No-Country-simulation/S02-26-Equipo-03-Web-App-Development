import crypto from "crypto";
const key = "56065e6a5decce35b0dbc78cc980c48fd33b661eca644cfce6a10b2507335010";
const hash = crypto.createHash("sha256").update(key).digest("hex");
console.log("Key:", key);
console.log("Hash:", hash);
