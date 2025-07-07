## Setup

```bash
# Github
git clone https://github.com/tuan24072002/ChatBox.git
```

## Install libraries

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:5173`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash

# npm
npm build

```

## Embed in another website

```js
<iframe
  src="https://example.app" // Your deployed URL
  style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 4160px;
      height: 5880px;
      border: none;
      z-index: 1000;
    "
  title="ChatBox"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```
