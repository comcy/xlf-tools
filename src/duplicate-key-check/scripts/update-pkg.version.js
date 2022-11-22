#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const fs = require("fs");

/**
 * Handling `\n` characters which can be returned by git commands
 */
const TRIM_REGEX = /\r?\n|\r/g;

/**
 * git commands
 */

const SHA_CMD = "git rev-parse --short HEAD";
// const CURRENT_BRANCH_CMD = 'git rev-parse --abbrev-ref HEAD';
// const CURRENT_BRANCH_CMD = 'git branch | grep \* | cut -d \' \' -f2';

const branchName = process.argv[2];

const branchParamIsSet = branchName ? true : false;

/**
 * Manipulates `version` property of the local `package.json`.
 * It appends a postfix-flag based on the latest git rev (HEAD).
 */
async function setVersionPostfix() {
  // GET CURRENT VERSION NAME
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  console.log("FOUND VERSION: ", packageJson["version"]);
  var version = packageJson["version"];

  // GET LATEST GIT COMMIT HASH
  const sha1 = await (await getGitRev(SHA_CMD)).replace(TRIM_REGEX, ""); // Commit hash
  console.log("COMMIT HASH: ", sha1);
  packageJson["version"] = `${version}-${sha1}`.trim();

  // CHECK IF BRANCH-PARAM IS SET
  if (branchParamIsSet) {
    // const branchName = await (await getGitRev(CURRENT_BRANCH_CMD)).replace(TRIM_REGEX, ''); // Branch name
    console.log("CURRENT BRANCH NAME: ", branchName);
    packageJson["version"] = `${version}-${branchName}-${sha1}`.trim();
  }

  var packageJsonString = JSON.stringify(packageJson, null, 2);
  console.log("UPDATED FILE: ", packageJsonString);

  fs.writeFileSync("package.json", packageJsonString);
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function getGitRev(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

setVersionPostfix();
