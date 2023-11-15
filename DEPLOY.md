# Deploying iwf

This guide will instruct you on how to deploy iwf

## Pre-commit

First, run `npm run lint` and `npm run test` to lint and test the project.

See if the results are acceptable. Then, push the result to Github.

## Tagging

* Then tag a new version on Github
* Increment the minor or the build number
* Write the change notes
* When the tag is saved, Github actions will trigger a build and upload to npm, and the building of the new documentation
