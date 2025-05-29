# PostmarkGBA

Connect your GBA Emulator to Postmark input/output and play via email.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node v20 or higher (Developed on 20)
- A Raspberry Pi with RetroPie running on top of Raspian OS (Do NOT use Raspberry Pi Imager to install RetroPie directly, it will conflict with the above Node requirements.). I used a Pi 4 4GB.
- A valid [Postmark](https://postmarkapp.com/) account and API key
- A functional (wired) USB Keyboard.


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

## Keep in mind

- Update RetroArch key inputs to the following:
  - D-PAD UP: Up Arrow Key
  - D-PAD LEFT: Left Arrow Key
  - D-PAD RIGHT: Right Arrow Key
  - D-PAD DOWN: Down Arrow Key
  - A: Z Key
  - B: X Key
  - START: Escape Key
  - SELECT: Tab Key
  - L: Q Key
  - R: O Key
  - HOTKEY: H Key
  - SCREENSHOT: T Key

By default, RetroArch uses HOTKEY + START to shut down the game. To prevent multiple requests from accidentally shutting down the game, you should also remap the EXIT hotkey.

## Features

- Full emulation of GBA.
- Inbound and outbound mails set up through Postmark.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
