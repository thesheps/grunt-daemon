export default interface Task {
  environment: string;
  awsRegion: string;
  repoUsernameKey: string;
  repoPasswordKey: string;
  repoUrl: string;
  processId: string;
}
