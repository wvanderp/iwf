# Browser test

## Why

When using the library in a browser, I encountered some problems. This test is to make sure that the library works in a browser.

## History

The first unit tests were written in Mocha, Chai, Sinon, and nyc. This did not work well with Typescript, so I switched to Jest.
Then, when I wanted to run a browser test, Typescript again became a problem.
I used @web/test-runner to run the tests in the browser. This did not work because Axios would not build with Esbuild.
Then I tried to use Karma, but that also was a mess.
So here I am with Cypress and a custom setup to run the tests in the browser.
