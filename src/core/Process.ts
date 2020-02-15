import * as fs from "fs";
import { SSM } from "aws-sdk";
import { clone } from "isomorphic-git";
import { plugins } from "isomorphic-git";

import Task from "./Task";

export default async (task: Task) => {
  const repoUsernameKey = task.repoUsernameKey ?? "GruntRepoUsername";
  const repoPasswordKey = task.repoPasswordKey ?? "GruntRepoPassword";
  const ssm = new SSM({ region: "eu-west-1" });

  const username = await ssm
    .getParameter({ Name: repoUsernameKey, WithDecryption: true })
    .promise();

  const password = await ssm
    .getParameter({ Name: repoPasswordKey, WithDecryption: true })
    .promise();

  plugins.set("fs", fs);

  await clone({
    url: task.repoUrl,
    dir: task.processId,
    username: username.Parameter.Value,
    password: password.Parameter.Value
  });
};
