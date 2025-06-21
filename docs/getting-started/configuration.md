# Configuration

VitoDeploy uses environment variables to configure the app.

If you've installed VitoDeploy on a VPS, You should see a `.env` file in the root of the project (
`/home/vito/vito/.env`). It is a normal Laravel env file which you can modify some of them.

If you are using the Docker version, you need to update the environment variables of your container.

## App URL

It is crucial to set the `APP_URL` environment variable to your Vito instance URL to ensure that features like Vito Logs
work properly.

## Email

To enable Vito to send you emails, You need to configure your mail server. Modify the following on the `.env` file

```txt
MAIL_HOST={YOUR-SMTP-HOST}
MAIL_PORT={YOUR-SMTP-PORT}
MAIL_USERNAME={YOUR-SMTP-USERNAME}
MAIL_PASSWORD={YOUR-SMTP-PASSWORD}
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS={YOUR-SMTP-MAIL-ADDRESS}
```

And then run the following commands inside the root directory of the project to apply the changes

```sh
php artisan optimize:clear
php artisan optimize
sudo supervisorctl restart worker:*
```

For docker version you will need to restart/re-create the container.

:::warning
Currently Vito supports only SMTP as the mail driver
:::