# Plugins

- [Introduction](#introduction)
- [What can Plugins Do?](#what-can-plugins-do)
- [Installing and Managing Plugins](#installing-and-managing-plugins)
- [Plugin Development](#plugin-development)
  - [Creating a Plugin](#creating-a-plugin)
  - [Plugin Service Provider](#plugin-service-provider)
  - [Register site types](#register-site-types)
  - [Register site features and actions](#register-site-features-and-actions)
  - [Register services](#register-services)
  - [Register server providers](#register-server-providers)
  - [Register storage providers](#register-storage-providers)
  - [Register source controls](#register-source-controls)
  - [Register notification channels](#register-notification-channels)
  - [Events](#events)
- [Publishing a Plugin](#publishing-a-plugin)

## Introduction

Vito supports plugins to extend its functionality and integrate with various services.

Plugins can be used to add new features or change the behavior of existing ones.

## What can Plugins Do?

Plugins can change or extend the following features:

- **Server Providers**: Add support for new server providers or modify existing ones.
- **Storage Providers**: Integrate with new storage providers or modify existing storage functionalities.
- **Source Controls**: Integrate with new source control systems or modify existing source control functionalities.
- **Notification Channels**: Integrate with new notification channels or modify existing ones.
- **Services**: Add new services or modify existing ones.
- **Site Types**: Add new site types or modify existing ones.
- **Site Features**: Add new site features or modify existing ones.

## Installing and Managing Plugins

You can install and manage plugins through the Vito web interface. Just navigate to the **Settings > Plugins** section,
where you can see the list of installed plugins and manage them.

Vito offers official and community plugins. Official plugins are developed and maintained by the Vito team, while
community plugins are developed by the community.

You can also install and manage plugins through the command line:

```bash
# install a plugin
php artisan plugin:install https://github.com/vitodeploy/laravel-octane-plugin

# uninstall a plugin
php artisan plugin:uninstall vitodeploy/laravel-octane-plugin

# see the list of installed plugins
php artisan plugin:list
```

:::info
If you are running Vito on docker, you will need to restart the container after installing or uninstalling a plugin.
:::

## Plugin Development

### Creating a Plugin

Plugins are basically Laravel packages that can be installed in Vito.

You will first need to have a basic understanding
of [Laravel package development](https://laravel.com/docs/12.x/packages).

You can use Vito's [plugin template](https://github.com/vitodeploy/plugin-template) to create a new plugin.

Here is how the `composer.json` should look like:

```json
{
  "name": "vendor/name",
  "description": "PLACEHOLDER plugin for VitoDeploy",
  "type": "library",
  "license": "MIT",
  "version": "1.0.0",
  "authors": [],
  "scripts": {
    "test": "vendor/bin/phpunit"
  },
  "require": {
    "php": "^8.4",
    "illuminate/support": "^12.0"
  },
  "require-dev": {
    "laravel/pint": "^1.10"
  },
  "autoload": {
    "psr-4": {
      "Vendor\\Name\\": "src"
    }
  },
  "extra": {
    "laravel": {
      "providers": [
        "Vendor\\Name\\PluginServiceProvider"
      ]
    }
  },
  "scripts": {
    "post-package-install": [
    "php artisan your:installation-command",
    "php artisan vendor:publish --tag=your-plugin-config"
  ],
  "pre-package-uninstall": [
    "php artisan your:uninstallation-command"
  ],
}
  "minimum-stability": "stable",
  "prefer-stable": true
}
```

#### Installation / Uninstallation tasks

You can define installation and uninstallation scripts in your plugin's `composer.json` file, those tasks will be executed when the plugin is installed or uninstalled.

Very useful for setting up and tearing down your plugin's environment, for instance setting up database values, publishing assets, fetching configuration files, etc.

```json
"scripts": {
  "post-package-install": [
    "php artisan your:installation-command",
    "php artisan vendor:publish --tag=your-plugin-config"
  ],
  "pre-package-uninstall": [
    "php artisan your:uninstallation-command"
  ],
}
```

:::info
Take a look at one example plugin to see how it
works: [VitoDeploy Laravel Octane Plugin](https://github.com/vitodeploy/laravel-octane-plugin)
:::

#### Local Setup

In order to develop plugins locally, you can put them directly into the `storage/plugins/your-vendor-name/plugin-name` and then run `php artisan plugins:load` so Vito can discover your plugin.

### Plugin Service Provider

Every plugin must have a service provider that extends `Illuminate\Support\ServiceProvider`.

The service provider must be registered in the `extra.laravel.providers` section of the `composer.json` file.

You can register the features of your plugin in the service provider's `boot` method after the application has booted.

Example:

```php
<?php

namespace VitoDeploy\YourPluginName;

use Illuminate\Support\ServiceProvider;

class YourPluginNameServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->app->booted(function () {
            // register features here
        });
    }
}
```

### Register site types

By registering a site type, you can add a new type of site that can be created in Vito.

Use `App\Plugins\RegisterSiteType` to register a new site type in your plugin's service provider.

```php
\App\Plugins\RegisterSiteType::make('symfony')
    ->label('Symfony')
    ->handler(SymfonyHandler::class)
    ->form(\App\DTOs\DynamicForm::make([
        \App\DTOs\DynamicField::make('php_version')
            ->component()
            ->label('PHP Version'),
        \App\DTOs\DynamicField::make('web_directory')
            ->text()
            ->label('Web Directory')
            ->placeholder('For / leave empty')
            ->description('The relative path of your website from /home/vito/your-domain/'),
    ]))
    ->register();
```

The `handler` method should point to a class that extends `App\SiteTypes\AbstractSiteType` or implements
`App\SiteTypes\SiteType`.

:::info
You can find some of the built-in site types are
in [Site Types](https://github.com/vitodeploy/vito/tree/3.x/app/SiteTypes)
:::

### Register site features and actions

Every site can have multiple features and every feature can have multiple actions.

For example, Laravel website has a feature called `Laravel Octane` which has actions like `Enable` and `Disable`.

You can register a new site feature for an already registered site type by using `App\Plugins\RegisterSiteFeature` in
your plugin's service provider.

Vito allows you to register a feature to a site with actions or register actions to an already existing feature.

```php
// register feature
\App\Plugins\RegisterSiteFeature::make('laravel', 'laravel-octane')
    ->label('Laravel Octane')
    ->description('Enable Laravel Octane for this site')
    ->register();
// register actions for the feature
\App\Plugins\RegisterSiteFeatureAction::make('laravel', 'laravel-octane', 'enable')
    ->label('Enable')
    ->form(\App\DTOs\DynamicForm::make([
        \App\DTOs\DynamicField::make('alert')
            ->alert()
            ->label('Alert')
            ->description('Make sure you have already set the `OCTANE_SERVER` in your `.env` file'),
        \App\DTOs\DynamicField::make('port')
            ->text()
            ->label('Octane Port')
            ->default(8000)
            ->description('The port on which Laravel Octane will run.'),
    ]))
    ->handler(Enable::class)
    ->register();
\App\Plugins\RegisterSiteFeatureAction::make('laravel', 'laravel-octane', 'disable')
    ->label('Disable')
    ->handler(Disable::class)
    ->register();
```

Every feature must implement the `App\SiteFeatures\FeatureInterface` interface.

Every action must extend the `App\SiteFeatures\Action` class or implement the `App\SiteFeatures\ActionInterface`
interface.

:::info
You can find an example of a site feature in
the [Laravel Octane Plugin](https://github.com/vitodeploy/laravel-octane-plugin)
:::

### Register services

Vito is a service-oriented server management system. By default, it comes with some built-in services like Nginx, MySQL,
Redis, etc.

However, you can register your own services using `App\Plugins\RegisterService` in your plugin's service provider.

```php
\App\Plugins\RegisterServiceType::make('nginx')
    ->type('webserver')
    ->label('Nginx')
    ->handler(Nginx::class)
    ->register();
\App\Plugins\RegisterServiceType::make('php')
    ->type('php')
    ->label('PHP')
    ->handler(PHP::class)
    ->versions([
        '8.4',
        '8.3',
        '8.2',
        '8.1',
        '8.0',
        '7.4',
        '7.3',
        '7.2',
        '7.1',
        '7.0',
        '5.6',
    ])
    ->data([
        'extensions' => [
            'imagick',
            'exif',
            'gmagick',
            'gmp',
            'intl',
            'sqlite3',
            'opcache',
        ],
    ])
    ->register();
```

**Service Types:**

Vito already supports multiple service types, and you can create alternatives for them.

For example, You can create an alternative web server service like Apache. or another database service like SQL server.

Supported service types are:

- `webserver`: Will be used for sites
- `database`: Will be used for databases
- `monitoring`: Will be used to monitor the server
- `memory_database`: Will be used for in-memory databases like Redis or Memcached
- `php`: Will be used for PHP versions
- `nodejs`: Will be used for Node.js versions
- `process_manager`: Will be used for Workers like Supervisor
- `firewall`: Will be used for firewall services like UFW or CSF

:::info
These were the services Vito has built-in web interface for them. You are not limited to these service types, and you
can create your own.
:::

**Service Handlers:**

Depending on your service type, You will need to implement a handler for your service which implements the interface of
that service type.

For example, If you develop a web server service, you will need to implement the `App\Services\Webserver\Webserver`
interface or extend the `App\Services\Webserver\AbstractWebserver` class.

:::info
For a non-listed service types, you can implement the `App\Services\ServiceInterface` interface or extend the
`App\Services\AbstractService` class.
:::

:::info
You can find plenty of examples in the [Services](https://github.com/vitodeploy/vito/tree/3.x/app/Services)
:::

### Register server providers

Vito already covers the most popular server providers like DigitalOcean, AWS, Vultr, Hetzner etc.

You can register your own server provider using `App\Plugins\RegisterServerProvider` in your plugin's service provider.

```php
\App\Plugins\RegisterServerProvider::make('hetzner')
    ->label('Hetzner')
    ->handler(Hetzner::class)
    ->form(
        \App\DTOs\DynamicForm::make([
            \App\DTOs\DynamicField::make('token')
                ->text()
                ->label('API Token'),
        ])
    )
    ->defaultUser('root') // The default ssh user of the server that the provider will create
    ->register();
```

The handler must implement the `App\ServerProviders\ServerProvider` interface or extend the
`App\ServerProviders\AbstractServerProvider` class.

:::info
You can find plenty of examples in
the [Server Providers](https://github.com/vitodeploy/vito/tree/3.x/app/ServerProviders)
:::

### Register storage providers

Vito supports multiple storage providers like S3 compatible, FTP, etc.

You can register your own storage provider using `App\Plugins\RegisterStorageProvider` in your plugin's service
provider.

```php
\App\Plugins\RegisterStorageProvider::make('local')
    ->label('Local')
    ->handler(Local::class)
    ->form(
        \App\DTOs\DynamicForm::make([
            \App\DTOs\DynamicField::make('path')
                ->text()
                ->label('Path'),
        ])
    )
    ->register();
```

The handler must implement the `App\StorageProviders\StorageProvider` interface or extend the
`App\StorageProviders\AbstractStorageProvider` class.

:::info
You can find plenty of examples in
the [Storage Providers](https://github.com/vitodeploy/vito/tree/3.x/app/StorageProviders)
:::

### Register source controls

Vito supports multiple source control providers like GitHub, GitLab, etc.

You can register your own source control provider using `App\Plugins\RegisterSourceControl` in your plugin's service
provider.

```php
\App\Plugins\RegisterSourceControl::make('github')
    ->label('GitHub')
    ->handler(GitHub::class)
    ->form(
        \App\DTOs\DynamicForm::make([
            \App\DTOs\DynamicField::make('token')
                ->text()
                ->label('Personal Access Token'),
        ])
    )
    ->register();
```

The handler must implement the `App\SourceControls\SourceControl` interface or extend the
`App\SourceControls\AbstractSourceControl` class.

:::info
You can find plenty of examples in the [Source Controls](https://github.com/vitodeploy/vito/tree/3.x/app/SourceControls)
:::

### Register notification channels

Vito supports multiple notification channels like Email, Slack, etc.

You can register your own notification channel using `App\Plugins\RegisterNotificationChannel` in your plugin's service
provider.

```php
\App\Plugins\RegisterNotificationChannel::make('slack')
    ->label('Slack')
    ->handler(Slack::class)
    ->form(
        \App\DTOs\DynamicForm::make([
            \App\DTOs\DynamicField::make('webhook_url')
                ->text()
                ->label('Webhook URL'),
        ])
    )
    ->register();
```

The handler must implement the `App\NotificationChannels\NotificationChannel` interface or extend the
`App\NotificationChannels\AbstractNotificationChannel` class.

:::info
You can find plenty of examples in
the [Notification Channels](https://github.com/vitodeploy/vito/tree/3.x/app/NotificationChannels)
:::

### Events

Vito fires events during `Service` installation and uninstallation this way you can tweak/extend the installation process, for example by modifying configuration files or setting up database tables/records.

You can listen to these events in your plugin's service provider:

```php
use App\Events\ServiceInstalled;
use App\Events\ServiceUninstalled;

class YourPluginServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Event::listen('service.installed', function (Service $service) {
            // Do something when the service is installed
            Log::info("Service installed: {$service->id}");
        });
        Event::listen('service.uninstalled', function (Service $service) {
            // Do something when the service is uninstalled
            Log::info("Service uninstalled: {$service->id}");
        });
    }
}
```

### Store Service Data

You can leverage the Service's `type_data` property to store any additional data you need, don't forget to honor other's properties when mutating it.

## Publishing a Plugin

Vito has a community plugins section on the web interface that users can install plugins from. To list your plugin
there, You need to publish your plugin as a public repository on GitHub and then add `vitodeploy-plugin` topic to it.

Example: https://github.com/vitodeploy/laravel-octane-plugin
