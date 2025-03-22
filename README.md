# Laravel

Because our repository doesn't have any ./vendor files (libs).
Run this command before continue, to generate it:

```sh
composer install
```

For application we need encryption key.
We should run this command to generate it:

```sh
php artisan key:generate
```

Now we can run Laravel Sail commands to build:

```sh
sail build
```

And command to build project (option -d we need for detached mode, for running in background):

```sh
sail up -d
```

# Root User data
login: root@mail.com
Password: Rfd#4543Fdd


# Vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates.

However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can run `Volar: Switch TS Plugin on/off` from VS Code command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
