# Remindy

![screenshot](screenshot.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-larsmikki%2Fremindy-blue?logo=docker)](https://hub.docker.com/r/larsmikki/remindy)
[![ghcr.io](https://img.shields.io/badge/ghcr.io-larsmikki%2Fremindy-blue?logo=github)](https://github.com/larsmikki/remindy/pkgs/container/remindy)
[![Node 20](https://img.shields.io/badge/Node-20-brightgreen?logo=node.js)](https://nodejs.org/)

**Remindy** is a self-hosted birthday reminder app. Keep track of birthdays, add tags and icons, and never forget an important date — no database, no cloud, no accounts required.

## Features

- Add birthdays with name, date, icon, and notes
- **Tags** — organize birthdays into custom categories
- Search and filter your list
- Countdown to the next birthday for each person
- Export and import backups as JSON
- 10+ built-in themes (light and dark)
- No database — all data stored in a single JSON file
- No tracking, no accounts, no cloud

## Getting started

Pick whichever install path matches your setup. All paths land on [http://localhost:3080](http://localhost:3080).

### 1. Docker (Docker Desktop, NAS, or any Docker server)

Works on Synology, Unraid, TrueNAS, QNAP, Proxmox, or a plain Docker host.

```bash
docker run -d \
  --name remindy \
  -p 3080:3080 \
  -v remindy-data:/app/data \
  --restart unless-stopped \
  larsmikki/remindy:latest
```

Or with Compose:

```yaml
services:
  remindy:
    image: larsmikki/remindy:latest
    container_name: remindy
    ports:
      - "3080:3080"
    volumes:
      - remindy-data:/app/data
    restart: unless-stopped

volumes:
  remindy-data:
```

### 2. Local install on Windows

Requires [Git for Windows](https://git-scm.com/download/win) and [Node.js 20+](https://nodejs.org/).

```powershell
git clone https://github.com/larsmikki/remindy.git
cd remindy
npm install
npm run dev      # Vite client on :3080
# In a second terminal:
npm run server   # API on :3081
```

For a production build: `npm run build && npm start`.

### 3. Local install on macOS

```bash
brew install node git
git clone https://github.com/larsmikki/remindy.git
cd remindy
npm install
npm run dev      # in one terminal
npm run server   # in another
```

For a production build: `npm run build && npm start`.

### 4. Local install on Linux

Debian/Ubuntu:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

git clone https://github.com/larsmikki/remindy.git
cd remindy
npm install
npm run dev      # in one terminal
npm run server   # in another
```

On Fedora/RHEL use `dnf install nodejs git`; on Arch use `pacman -S nodejs npm git`.

For a production build: `npm run build && npm start`.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3080` | Port the server listens on |
| `BIRTHDAYS_FILE` | `/app/data/birthdays.json` | Path to the data file |

## Usage

| Action | How |
|--------|-----|
| Add a birthday | Click **Add Reminder** |
| Edit | Click the pencil icon on any card |
| Add tags | **Settings → Tags** |
| Filter by tag | Click a tag badge on the main page |
| Export backup | **Settings → Export** |
| Import backup | **Settings → Import** |
| Change theme | **Settings → Themes** |

## Data

All data is stored in a single file in the Docker volume:

```
/app/data/
  birthdays.json    # all birthdays, tags, and settings
```

## License

[MIT](LICENSE)

## Support

If Remindy saves you time, consider [buying me a coffee](https://buymeacoffee.com/larsmikki) or [donating via PayPal](https://paypal.me/larsmikki). It helps keep the project free and maintained.
