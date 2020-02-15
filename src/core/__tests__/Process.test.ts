import * as fs from "fs";
import { SecretsManager } from "aws-sdk";
import { clone, plugins } from "isomorphic-git";

import Process from "../Process";
import Task from "../Task";

jest.mock("fs");
jest.mock("aws-sdk");
jest.mock("isomorphic-git");

describe("Process", () => {
  const mockGetSecretValue = jest.fn();
  const mockPromise = jest.fn();

  const task: Task = {
    environment: "dev",
    awsRegion: "eu-west-1",
    repoUsernameKey: "My Username",
    repoPasswordKey: "My Password",
    workspaceDir: "workspace",
    repoUrl: "repoUrl"
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockPromise
      .mockResolvedValueOnce({ SecretString: "JoeBloggs" })
      .mockResolvedValueOnce({ SecretString: "DeadStrongPassword" });

    SecretsManager.prototype.getSecretValue = mockGetSecretValue;
    mockGetSecretValue.mockReturnValue({
      promise: mockPromise
    });

    plugins.set = jest.fn();
  });

  it("obtains credentials from AWS Params Store", async () => {
    await Process(task);

    expect(mockGetSecretValue).toHaveBeenNthCalledWith(1, {
      SecretId: `grunt/${task.environment}/${task.repoUsernameKey}`
    });

    expect(mockGetSecretValue).toHaveBeenNthCalledWith(2, {
      SecretId: `grunt/${task.environment}/${task.repoPasswordKey}`
    });
  });

  it("clones the named repository using the provided creds", async () => {
    await Process(task);

    expect(clone).toHaveBeenCalledWith({
      url: task.repoUrl,
      dir: task.workspaceDir,
      username: "JoeBloggs",
      password: "DeadStrongPassword"
    });
  });

  it("configures isometric git with a filesystem", async () => {
    await Process(task);

    expect(plugins.set).toHaveBeenCalledWith("fs", fs);
  });
});
