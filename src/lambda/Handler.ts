import { Context } from "aws-lambda";

import Event from "./Event";
import Process from "../core/Process";
import Task from "../core/Task";

export const handle = (event: Event, context: Context) => {
  const task: Task = {
    awsRegion: process.env.AWS_REGION,
    processId: context.awsRequestId,
    repoUrl: event.repoUrl,
    repoUsernameKey: event.repoUsernameKey,
    repoPasswordKey: event.repoPasswordKey
  };

  Process(task);
};
