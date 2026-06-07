code quality is more important then getting things done fast. documentation, tests, and code readability are all important. if you have to choose between writing a test or writing documentation, write the test. if you have to choose between writing documentation or writing code, write the documentation. if you have to choose between writing code or writing tests, write the tests.

---

In this project we fix every error we find. even if we did not introduce the error, we will fix it. and we dont fix the symptoms, we fix the root cause. if we find a bug, we will write a test that reproduces the bug, and then we will fix the bug.

---

In this project we try to mock as little as possible. we prefer to write integration tests that test the whole system, rather than unit tests that test individual components. we prefer to use real data and real APIs, rather than mock data and mock APIs. the only thing we mock are the side effects, such as network requests and file system access. we do not mock the logic of the code, we want to test the logic of the code as much as possible.