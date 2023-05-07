this guide will instruct you on how to deploy iwf

## pre-commit

First, run `npm run lint` and `npm run test` to lint and test the project. 

See if the results are acceptable. Then push the result to Github.

## tagging

then tag a new version on Github
increment the minor or the build number
write the change notes 
when the tag is saved, Github actions will trigger a build and upload to npm, and the building of the new documentation
