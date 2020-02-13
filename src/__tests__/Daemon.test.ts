import { config, SQS } from "aws-sdk";

import Daemon from "../Daemon";

jest.mock("aws-sdk");

describe("daemon", () => {
  it("configures aws with the specified values", () => {
    const queueUrl = "https://sqs.eu-west-1.amazonaws.com/123456789012/mytopic";
    const daemon = new Daemon({ region: "eu-west-1", queueUrl });

    expect(config.update).toHaveBeenCalledWith({ region: "eu-west-1" });
    expect(SQS).toHaveBeenCalledWith({ apiVersion: "2012-11-05" });
  });

  it("throws a url malformed error with a bad queue name", () => {
    expect(() => {
      new Daemon({ region: "eu-west-1", queueUrl: "My Queue" });
    }).toThrowError("The specified SQS Url is invalid");
  });
});
