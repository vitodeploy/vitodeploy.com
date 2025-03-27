# Source Controls

- [Introduction](#introduction)
- [Supported Providers](#supported-providers)
- [Required API Permissions](#required-api-permissions)
  - [Github](#github)
  - [Gitlab](#gitlab)
  - [Bitbucket](#bitbucket)
- [Scope](#scope)

## Introduction

Vito uses source controls to pull your source codes for the websites you install. It also uses to set up hooks for auto
deployments.

## Supported Providers

- GitHub
- Gitlab (Cloud and Self-hosted)
- Bitbucket

## Required API Permissions

Vito connects to the source control providers via their APIs. To connect to the source control providers the following
information is required:

### Github

Generate a personal access token on GitHub settings of your account and give it full repository control and git hook
admin.

### Gitlab

Generate a personal access token on your Gitlab profile and give it repository and webhook admin.

### Bitbucket

Create an App Password on your Bitbucket account and give it repository and webhook admin permissions.

## Scope

Source controls can be created under a specific project or globally.

If you create a source control under a project, it will only be available for that project.

If you create a source control globally, it will be available for all projects.

The reason of this feature is when you add a new user to VitoDeploy, you can control which source controls they can
access.
