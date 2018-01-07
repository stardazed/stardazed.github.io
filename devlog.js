// @ts-check
// create devlog post for today
const spawn = require("child_process").spawn;
const now = new Date();
const year = now.getUTCFullYear().toString();
const month = now.toUTCString().split(" ")[2];
const day = now.getUTCDate().toString();
spawn("node", ["post", "DevLog", "-", month, day + ",", year]);
