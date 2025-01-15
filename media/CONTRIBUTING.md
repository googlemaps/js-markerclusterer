# How to become a contributor and submit your own code

1.  Submit an issue describing your proposed change to the repo in question.
1.  The repo owner will respond to your issue promptly.
1.  Fork the desired repo, develop and test your code changes.
1.  Ensure that your code adheres to the existing style in the code to which
    you are contributing.
1.  Ensure that your code has an appropriate set of tests which all pass.
1.  Title your pull request following [Conventional Commits](https://www.conventionalcommits.org/) styling.
1.  Submit a pull request.

## Running the tests

1.  Install dependencies:

        npm i
1.  Run lint

        npm run lint
        npm run format  # will fix some issues

1.  Run the tests:

        # Run unit tests.
        npm test
