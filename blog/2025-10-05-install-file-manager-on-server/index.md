---
slug: install-file-manager-on-server
title: Install File Manager on Server
authors: [saeedvaziry]
tags: [tutorial, file-manager, plugins]
---

Sometimes you may need a web-based file manager to easily manage files on your server. In this tutorial, I will show you how to install and configure a file manager on your server using VitoDeploy.

<!-- truncate -->

VitoDeploy provides a plugin called [Tiny File Manager Plugin](/docs/plugins/tiny-file-manager) that allows you to easily install and configure [Tiny File Manager](https://tinyfilemanager.github.io/) on your server.

## Install the Plugin

To install the plugin, navigate to the `Settings -> Plugins` and select `Tiny File Manager` plugins in the `Official` tab.

## Create a New Site with Tiny File Manager

After installing the plugin, there will be a new site type appearing when you're selecting a site type to create a new site.

You can select the `Tiny File Manager` site type and provide the following required information:

- Domain: The domain or subdomain where you want to access the file manager.
- PHP Version: The PHP version to use for the file manager.
- Admin Password: The password to access the file manager.
- Path to Manage: The directory path on the server that you want to manage with the file manager.

:::warning
Your server must have PHP installed to run Tiny File Manager.
:::

## Access the File Manager

Once the site is created, you can access the Tiny File Manager by navigating to the domain or subdomain you specified during the site creation.

## Caution

File managers can pose security risks even if they are secured properly. It is recommended to use file managers only on development or staging servers and avoid using them on production servers.
