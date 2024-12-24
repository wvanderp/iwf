# Deploying iwf

This guide will instruct you on how to deploy iwf

## Pre-commit

First, run `npm run lint` and `npm run test` and `npm run test:all` to lint and test the project.

See if the results are acceptable. Then, push the result to Github.

## Tagging

* Create tag a new version on Github
  * The tag should be in the format `vX.Y.Z` where X is the major version, Y is the minor version, and Z is the build number
  * Increment the minor or the build number
* Write the change notes
* When the tag is saved, Github actions will trigger a build and upload to npm, and the building of the new documentation

## Automatic Release

When a new release tag is published, the workflow checks out code, installs Node.js 20, updates package.json to the release tag, builds and tests, then automatically publishes to npm and pushes the version bump back to GitHub.
