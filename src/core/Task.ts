export default interface Task {
  awsRegion: string;
  repoUsernameKey?: string;
  repoPasswordKey?: string;
  repoUrl: string;
  processId: string;
}
