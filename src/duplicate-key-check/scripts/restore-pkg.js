const fs = require("fs"); // read lib name from cmd param
const path = require("path");

const PKG_ORIGIN_PATH = path.resolve(__dirname, "../package.json");
const PKG_CACHED_PATH = path.resolve(__dirname, "../package-cached.json");

console.log("restore ...");

fs.unlinkSync(PKG_ORIGIN_PATH);

fs.renameSync(PKG_CACHED_PATH, PKG_ORIGIN_PATH);
