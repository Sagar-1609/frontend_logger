# How to Publish to NPM

You have prepared your package! Here are the steps to actually publish it to the NPM registry so anyone can use it.

## Prerequisites

1.  **Create an NPM Account**: Go to [npmjs.com/signup](https://www.npmjs.com/signup) if you haven't already.
2.  **Verify Email**: Make sure you verify your email address.

## Publishing Steps

### 1. Login to NPM

Run this command in your terminal and follow the prompts (enters username, password, and email):

```bash
npm login
```

### 2. Publish

Run the publish command:

```bash
npm publish --access public
```

- `--access public` is important for the first time if you have a scoped package (e.g., `@yourname/package`), but for a normal name like `frontend-terminal-logger` it's the default.
- **Note**: `frontend-terminal-logger` might already be taken. If you get a **403 Forbidden** error, change the `"name"` in `package.json` to something unique (e.g., `my-frontend-logger-123`).

### 3. Verify

Visit `https://npmjs.com/package/<your-package-name>` to see it live!

## How to Update Later

When you make changes to your code:

1.  **Update Version**:
    ```bash
    npm version patch  # For bug fixes (1.0.0 -> 1.0.1)
    npm version minor  # For new features (1.0.0 -> 1.1.0)
    ```
2.  **Publish Again**:
    ```bash
    npm publish
    ```
