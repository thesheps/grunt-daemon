import { Context } from "aws-lambda";

import Event from "./Event";
import Process from "../core/Process";
import Task from "../core/Task";

const workspaceRoot = "/tmp/grunt-daemon";

export const handle = (event: Event, context: Context) => {
  const task: Task = {
    environment: process.env.ENVIRONMENT,
    awsRegion: process.env.AWS_REGION,
    repoUrl: event.repoUrl,
    repoUsernameKey: event.repoUsernameKey,
    repoPasswordKey: event.repoPasswordKey,
    workspaceDir: `${workspaceRoot}/${context.awsRequestId}`
  };

  Process(task);
};
