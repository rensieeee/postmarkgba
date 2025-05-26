# PostmarkGBA

Connect your GBA Emulator to Postmark input/output and play via email.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
# Clone the repository
git clone https://github.com/rensieeee/postmarkgba.git

# Change directory
cd postmarkgba

# Install dependencies
npm install
```

## Usage

Before running, make sure you have a working Postmark API key with emails set up.

PostmarkGBA also requires a working GBA emulator (we use RetroArch), as well as a physical keyboard for inputs.

```bash
# Example command to start the project
cp .env.example .env # Update .env values to your paths/url's.

npm run start:dev
```

## Features

- Full emulation of GBA.
- Inbound and outbound mails set up through Postmark.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
