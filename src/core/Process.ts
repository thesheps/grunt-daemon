import * as fs from "fs";
import { SecretsManager } from "aws-sdk";
import { clone } from "isomorphic-git";
import { plugins } from "isomorphic-git";

import Task from "./Task";

export default async (task: Task) => {
  const repoUsernameKey = `/grunt/${task.environment}/${task.repoUsernameKey}`;
  const repoPasswordKey = `/grunt/${task.environment}/${task.repoPasswordKey}`;
  const secretsManager = new SecretsManager({ region: "eu-west-1" });

  const username = await secretsManager
    .getSecretValue({ SecretId: repoUsernameKey })
    .promise();

  const password = await secretsManager
    .getSecretValue({ SecretId: repoPasswordKey })
    .promise();

  plugins.set("fs", fs);

  await clone({
    url: task.repoUrl,
    dir: task.processId,
    username: username.SecretString,
    password: password.SecretString
  });
};
