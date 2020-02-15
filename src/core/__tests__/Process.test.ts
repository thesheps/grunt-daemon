import * as fs from "fs";
import { SSM } from "aws-sdk";
import { clone, plugins } from "isomorphic-git";

import Process from "../Process";
import Task from "../Task";

jest.mock("fs");
jest.mock("aws-sdk");
jest.mock("isomorphic-git");

describe("Process", () => {
  const mockGetParameter = jest.fn();
  const mockPromise = jest.fn();

  const event: Task = {
    awsRegion: "eu-west-1",
    repoUsernameKey: "My Username",
    repoPasswordKey: "My Password",
    processId: "12345",
    repoUrl: "repoUrl"
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockPromise
      .mockResolvedValueOnce({ Parameter: { Value: "JoeBloggs" } })
      .mockResolvedValueOnce({ Parameter: { Value: "DeadStrongPassword" } });

    SSM.prototype.getParameter = mockGetParameter;
    mockGetParameter.mockReturnValue({
      promise: mockPromise
    });

    plugins.set = jest.fn();
  });

  it("obtains credentials from AWS Params Store", async () => {
    await Process(event);

    expect(mockGetParameter).toHaveBeenNthCalledWith(1, {
      Name: event.repoUsernameKey,
      WithDecryption: true
    });

    expect(mockGetParameter).toHaveBeenNthCalledWith(2, {
      Name: event.repoPasswordKey,
      WithDecryption: true
    });
  });

  it("clones the named repository using the provided creds", async () => {
    await Process(event);

    expect(clone).toHaveBeenCalledWith({
      url: event.repoUrl,
      dir: event.processId,
      username: "JoeBloggs",
      password: "DeadStrongPassword"
    });
  });

  it("defaults repo key names to sensible defaults", async () => {
    await Process({ repoUrl: "foo", processId: "bar", awsRegion: "baz" });

    expect(mockGetParameter).toHaveBeenNthCalledWith(1, {
      Name: "GruntRepoUsername",
      WithDecryption: true
    });

    expect(mockGetParameter).toHaveBeenNthCalledWith(2, {
      Name: "GruntRepoPassword",
      WithDecryption: true
    });
  });

  it("configures isometric git with a filesystem", async () => {
    await Process({ repoUrl: "foo", processId: "bar", awsRegion: "baz" });

    expect(plugins.set).toHaveBeenCalledWith("fs", fs);
  });
});
