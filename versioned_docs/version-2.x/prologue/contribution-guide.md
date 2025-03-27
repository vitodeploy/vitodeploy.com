# Contribution Guide

- [Environment Setup](#environment-setup)
- [Development Discussion](#development-discussion)
- [Which Branch?](#which-branch)
- [Security Vulnerabilities](#security-vulnerabilities)
- [Coding Style](#coding-style)
- [Code of Conduct](#code-of-conduct)

## Environment Setup

Set up your local environment by following the [installation documentation](./installation#install-locally)

## Development Discussion

You may propose new features or improvements of existing behavior in the
repository's [Discussion Board](https://github.com/vitodeploy/vito/discussions). If you propose a new feature,
please be willing to implement at least some of the code that would be needed to complete the feature.

Informal discussion regarding bugs, new features, and implementation of existing features takes place in the #ideas
channel of our [Discord](https://discord.gg/uZeeHZZnm5) server.

:::warning
Please do not refactor any existing code without discussing it with the maintainers first.
:::

## Which Branch?

All bug fixes should be sent to the latest version that supports bug fixes (currently `2.x`).

Minor features that are fully backward compatible with the current release may be sent to the latest stable branch (
currently `2.x`).

Major new features or features with breaking changes should always be sent to the `main` branch, which contains the
upcoming major release.

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please email to Saeed Vaziry at sa.vaziry@gmail.com.
All security vulnerabilities will be promptly addressed.

## Coding Style

The coding style is already hardcoded in configurations inside the project.

For PHP codes you may run `./vendor/bin/pint` to fix your coding styles.

And for the frontend codes you may run `npm run lint:fix` to fix your frontend coding styles.

These two commands should be run before opening a PR, Otherwise the checks on your PR will fail.

## Code of Conduct

Violations of the code of conduct should be reported to Saeed Vaziry at sa.vaziry@gmail.com.

- Participants should embrace tolerance toward differing opinions.
- It is imperative for participants to use language and exhibit behaviors that avoid personal attacks and demeaning
  comments.
- When evaluating the statements and actions of others, it is crucial to presume positive intentions.
- Any behavior deemed as reasonably constituting harassment is strictly prohibited.
