import { config, SQS } from "aws-sdk";

import Configuration from "./Configuration";

const ERROR_STRING = "The specified SQS Url is invalid";
const REGEX = new RegExp(
  "^https://sqs.[a-z]{2}-[a-z]{4}-[0-9].amazonaws.com/[0-9]{12}/.*"
);

export default class Daemon {
  private _SQS: SQS;

  constructor(configuration: Configuration) {
    if (!REGEX.test(configuration.queueUrl))
      throw new Error(`${ERROR_STRING}: ${configuration.queueUrl}`);

    config.update({ region: configuration.region });
    this._SQS = new SQS({ apiVersion: "2012-11-05" });
  }
}
