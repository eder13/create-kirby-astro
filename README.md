# create-astro-kirby

Use Astro directly within Kirby CMS. Deploy Astro static assets from the Kirby Panel.

## Requirements:

- NPM/NodeJS
- Composer/PHP

## Features

- Use Astro as the Frontend in a Kirby environment
- supports German (de), English (en), Spanish (es), French (fr) and Italian (it) as Language
- single page and multi page support with automatic language detection and redirection
- SEO optimized out of the Box
- up to date with the latest Astro and Kirby versions

## Usage

### Single Language Setup

```txt
# Single page with english language and US as locale (default)
node bin/index.js --name="myProjectName"

# Single page with german language and Germany as locale
node bin/index.js --name="myProjectName" --langs="[de]" --locales="[de-DE]"
```

### Multi Language Setup

```txt
# Multi page setup with english as default language and german as second language
node bin/index.js --name="myProjectName" --langs="[en, de]" --locales="[en-GB, de-AT]"
```

## Quick Start

1. Copy the content of your generated folder to your server environment (e.g. htdocs in XAMPP).

2. Grant permissions: `sudo chmod -R 777 /path/to/your/htdocs`

3. Go to https://localhost/cms/panel and install Kirby

4. To build for Astro, click on the "Build" Button in the Kirby Panel. It requires a password which is specified in the .env file, per default it is `my-secret-password`.
   Once the Build is done, click the "Publish" Button.

5. Go to https://localhost to see the result.

## Local Dev

For astro you can use the dev server for HMR. Use it with `npm run dev` inside the `frontend/` folder.
