import { Context } from "aws-lambda";

import Process from "../../core/Process";
import { handle } from "../Handler";

jest.mock("../../core/Process");

describe("Handler", () => {
  it("calls the process function with the expected values", () => {
    const context = { awsRequestId: "12345-67890" } as Context;
    const repoUrl = "https://my-git-url";
    const repoUsernameKey = "UsernameKey";
    const repoPasswordKey = "PasswordKey";
    process.env.AWS_REGION = "MY_TEST_REGION";

    handle({ repoUrl, repoUsernameKey, repoPasswordKey }, context);

    expect(Process).toHaveBeenCalledWith({
      awsRegion: process.env.AWS_REGION,
      repoUsernameKey,
      repoPasswordKey,
      repoUrl,
      processId: context.awsRequestId
    });
  });
});
