import { Context } from "aws-lambda";

import Process from "./Process";
import Event from "./Event";
import Task from "./Task";

export default {
  handle: (event: Event, context: Context) => {
    const task: Task = {
      awsRegion: process.env.AWS_REGION,
      processId: context.awsRequestId,
      repoUrl: event.repoUrl,
      repoUsernameKey: event.repoUsernameKey,
      repoPasswordKey: event.repoPasswordKey
    };

    Process(task);
  }
};
