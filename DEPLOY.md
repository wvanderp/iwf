# Deploying iwf

This guide will instruct you on how to deploy iwf

## Pre-commit

First, run `pnpm run lint` and `pnpm run test` and `pnpm run test:all` to lint and test the project.

See if the results are acceptable. Then, push the result to Github.

## Tagging

* Bump the `version` field in `package.json` (for example with `pnpm version --no-git-tag-version X.Y.Z`) and commit it
* Create tag a new version on Github
  * The tag should be in the format `vX.Y.Z` where X is the major version, Y is the minor version, and Z is the build number
  * Increment the minor or the build number
  * The tag must equal `v` followed by the `package.json` version (for example `v1.2.3` for version `1.2.3`), otherwise the publish workflow fails
* Write the change notes
* When the tag is saved, Github actions will trigger a build and upload to npm, and the building of the new documentation

## Automatic Release

When a new release is published, the workflow checks out its tag, verifies that the release tag matches the `package.json` version, installs Node.js 24, builds and tests, then publishes to npm using a short-lived OIDC credential. The workflow can also be started manually for an existing release tag.

Before the first OIDC publish, configure npm trusted publishing for the `iwf` package:

1. Open the package's **Settings → Trusted publishing** page on npm.
2. Select **GitHub Actions**.
3. Set the GitHub user to `wvanderp`, repository to `iwf`, and workflow filename to `publish.yml`.
4. Allow direct `npm publish` and save the trusted publisher.

No npm token is required by the workflow. After verifying the first OIDC publish, revoke any obsolete automation token and set npm publishing access to require two-factor authentication while disallowing tokens.
