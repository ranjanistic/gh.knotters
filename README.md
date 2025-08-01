# knotters-bot

> The knottersbot to help Knotters track GitHub activities.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t knotters-bot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> knotters-bot
```

## Contributing

If you have suggestions for how knotters-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

© 2022 Knotters <contact@knotters.org>
