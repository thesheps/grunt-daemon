import * as fs from "fs";
import { spawn } from "child_process";
import { SecretsManager } from "aws-sdk";
import { clone, plugins } from "isomorphic-git";

import Process from "../Process";
import Task from "../Task";

jest.mock("child_process");
jest.mock("fs");
jest.mock("aws-sdk");
jest.mock("isomorphic-git");

console.log = jest.fn();

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

    (spawn as jest.Mock).mockReturnValue({
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() }
    });

    plugins.set = jest.fn();
  });

  describe("Credentials management", () => {
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
  });

  describe("Source control interaction", () => {
    it("configures isometric git with a filesystem", async () => {
      await Process(task);

      expect(plugins.set).toHaveBeenCalledWith("fs", fs);
    });
  });

  describe("Task execution", () => {
    it("executes a script named 'init.sh' if one isn't otherwise provided", async () => {
      await Process(task);

      expect(spawn).toHaveBeenCalledWith("sh", ["init.sh"], {
        cwd: `${task.workspaceDir}/.grunt`
      });
    });
  });
});
