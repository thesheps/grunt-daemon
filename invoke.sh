#! /bin/bash

aws lambda invoke \
    --function-name grunt-dev-daemon \
    --payload '{ "repoUrl": "https://github.com/thesheps/grunt-daemon",
                 "repoUsernameKey": "repo_username",
                 "repoPasswordKey": "repo_password" }' \
    response.json