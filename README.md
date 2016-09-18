# ctor-cli

Build a command line app from a constructor.

## Why?

It's a hassle to create Node.js CLIs from scratch. Also, I realized CLI commands are functions in themselves that you pass arguments in it to perform set(s) of instructions.

## Notes

This is an experimental work. I'm not yet sure if this is secure enough, since it attempts to parse the function (using [`doctrine`](https://github.com/eslint/doctrine) and [`esprima`](https://github.com/jquery/esprima)). However, it only reads arguments and JSDoc annotations (which by the way I overloaded it to accommodate the CLI arguments, so `@arg` does different here now. It still conforms to the [JSDoc](http://usejsdoc.org) spec so you might want to read on). Let me know if it raises concerns or you might want to suggest features to be (re)written.

## Contribution

Sure thing! Just clone the repo.

Please star the repo if you find it useful in your projects.

## License

MIT. See [LICENSE file](https://raw.githubusercontent.com/Temoto-kun/ctor-cli/master/LICENSE) for details.
