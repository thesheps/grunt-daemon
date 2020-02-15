import Process from "./src/Core/Process";

Process({
  environment: "dev",
  workspaceDir: "./test",
  awsRegion: "eu-west-1",
  repoUrl: "https://github.com/thesheps/grunt-daemon",
  repoUsernameKey: "repo_username",
  repoPasswordKey: "repo_password"
});
