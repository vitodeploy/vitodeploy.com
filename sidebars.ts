import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    tutorialSidebar: [
        {
            "type": "category",
            "label": "Prologue",
            "items": [
                {
                    "type": "doc",
                    "label": "Release Notes",
                    "id": "prologue/release-notes"
                },
                {
                    "type": "doc",
                    "label": "Upgrade Guide",
                    "id": "prologue/upgrade"
                },
                {
                    "type": "doc",
                    "label": "Contribution Guide",
                    "id": "prologue/contribution-guide"
                }
            ]
        },
        {
            "type": "category",
            "label": "Getting Started",
            "items": [
                {
                    "type": "doc",
                    "label": "Introduction",
                    "id": "getting-started/introduction"
                },
                {
                    "type": "doc",
                    "label": "Installation",
                    "id": "getting-started/installation"
                },
                {
                    "type": "doc",
                    "label": "Securing",
                    "id": "getting-started/securing"
                },
                {
                    "type": "doc",
                    "label": "Configuration",
                    "id": "getting-started/configuration"
                },
                {
                    "type": "doc",
                    "label": "Update",
                    "id": "getting-started/update"
                }
            ]
        },
        {
            "type": "category",
            "label": "Servers",
            "items": [
                {
                    "type": "doc",
                    "id": "servers/database"
                },
                {
                    "type": "doc",
                    "id": "servers/php"
                },
                {
                    "type": "doc",
                    "id": "servers/firewall"
                },
                {
                    "type": "doc",
                    "id": "servers/cronjobs"
                },
                {
                    "type": "doc",
                    "id": "servers/workers"
                },
                {
                    "type": "doc",
                    "id": "servers/ssh-keys"
                },
                {
                    "type": "doc",
                    "id": "servers/services"
                },
                {
                    "type": "doc",
                    "id": "servers/monitoring"
                },
                {
                    "type": "doc",
                    "id": "servers/console"
                },
                {
                    "type": "doc",
                    "id": "servers/redis"
                },
                {
                    "type": "doc",
                    "id": "servers/settings"
                },
                {
                    "type": "doc",
                    "id": "servers/logs"
                },
                {
                    "type": "doc",
                    "id": "servers/file-manager"
                }
            ]
        },
        {
            "type": "category",
            "label": "Sites",
            "items": [
                {
                    "type": "doc",
                    "id": "sites/site-types"
                },
                {
                    "type": "doc",
                    "id": "sites/application"
                },
                {
                    "type": "doc",
                    "id": "sites/ssl"
                },
                {
                    "type": "doc",
                    "id": "sites/settings"
                },
                {
                    "type": "doc",
                    "id": "sites/isolation"
                },
                {
                    "type": "doc",
                    "id": "sites/load-balancer"
                },
                {
                    "type": "doc",
                    "id": "sites/redirects"
                }
            ]
        },
        {
            "type": "doc",
            "label": "Scripts",
            "id": "scripts"
        },
        {
            "type": "doc",
            "label": "Plugins",
            "id": "plugins"
        },
        {
            "type": "category",
            "label": "Settings",
            "items": [
                {
                    "type": "doc",
                    "id": "settings/profile"
                },
                {
                    "type": "doc",
                    "id": "settings/projects"
                },
                {
                    "type": "doc",
                    "id": "settings/server-providers"
                },
                {
                    "type": "doc",
                    "id": "settings/source-controls"
                },
                {
                    "type": "doc",
                    "id": "settings/notification-channels"
                },
                {
                    "type": "doc",
                    "id": "settings/storage-providers"
                }
            ]
        }
    ],
};

export default sidebars;
