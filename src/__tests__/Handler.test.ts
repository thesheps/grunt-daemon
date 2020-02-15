import { Context } from "aws-lambda";

import Handler from "../Handler";
import Process from "../Process";

jest.mock("../Process");

describe("Handler", () => {
  it("calls the process function with the expected values", () => {
    const context = { awsRequestId: "12345-67890" } as Context;
    const repoUrl = "https://my-git-url";
    const repoUsernameKey = "UsernameKey";
    const repoPasswordKey = "PasswordKey";
    process.env.AWS_REGION = "MY_TEST_REGION";

    Handler.handle({ repoUrl, repoUsernameKey, repoPasswordKey }, context);

    expect(Process).toHaveBeenCalledWith({
      awsRegion: process.env.AWS_REGION,
      repoUsernameKey,
      repoPasswordKey,
      repoUrl,
      processId: context.awsRequestId
    });
  });
});
