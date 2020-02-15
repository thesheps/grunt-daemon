import * as fs from "fs";
import { spawn } from "child_process";
import { SecretsManager } from "aws-sdk";
import { clone, plugins } from "isomorphic-git";

import Task from "./Task";

const getKeyPath = (env: string, key: string) => {
  return `grunt/${env}/${key}`;
};

export default async (task: Task) => {
  const secretsManager = new SecretsManager({ region: "eu-west-1" });
  const repoUsernameKey = getKeyPath(task.environment, task.repoUsernameKey);
  const repoPasswordKey = getKeyPath(task.environment, task.repoPasswordKey);

  const username = await secretsManager
    .getSecretValue({ SecretId: repoUsernameKey })
    .promise();

  const password = await secretsManager
    .getSecretValue({ SecretId: repoPasswordKey })
    .promise();

  plugins.set("fs", fs);

  await clone({
    url: task.repoUrl,
    dir: task.workspaceDir,
    username: username.SecretString,
    password: password.SecretString
  });

  const command = spawn("sh", ["init.sh"], {
    cwd: `${task.workspaceDir}/.grunt`,
    stdio: [process.stdin, process.stdout, process.stderr]
  });

  console.log("stdout: ", command.stdout.toString("utf-8"));
  console.log("stderr: ", command.stderr.toString("utf-8"));
};
