// @ts-check
const fs = require("fs");
const spawn = require("child_process").spawn;

const title = process.argv.slice(2).join(" ") || "Untitled";
const fileTitle = title.split(" ").map(s => s.toLowerCase().replace(/[\\\/\?\!\-'",\.\t]/g, "")).filter(s => s.length > 0).join("-");

const now = new Date();
const date = now.toISOString().replace("T", " ").replace("Z", " +0000").replace(/\.\d\d\d/, "");
const paddedMonth = `0${now.getUTCMonth() + 1}`.substr(-2);
const paddedDay = `0${now.getUTCDate()}`.substr(-2);

const fileName = `${now.getUTCFullYear()}-${paddedMonth}-${paddedDay}-${fileTitle}.md`;
const filePath = `_posts/${fileName}`;

const header = `---
layout: post
title:  "${title}"
date:   ${date}
---

`;

// use append to avoid overwriting blog files
fs.appendFile(filePath, header, (err) => {
	if (err) throw err;
	spawn("open", [filePath]);
});
