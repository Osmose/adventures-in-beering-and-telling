# Adventures in Beering and Telling

The culmination of my life's work.

## Developer Setup

adventures-in-beering-and-telling uses [Bower](http://bower.io/) to download its
dependencies.

1. Clone the repo: `git clone git://github.com/Osmose/adventures-in-beering-and-telling.git; cd barber-shop`
2. Install dependencies using Bower: `bower install`.

### (Optional) Set up Grunt

If you also have [Grunt](http://gruntjs.com/) installed there's a convenient
server for viewing the pages in a web browser.

3. Install Grunt and the plugins locally: `npm install`
4. Run the development server with `grunt runserver`. It should be available at
   http://localhost:8000.

## Deployment

The `grunt deploy` command will deploy the contents of the `src` folder to the `gh-pages` branch
of the `origin` remote on your repository.

## License

Copyright (c) 2013 Michael Kelly
Licensed under the  MIT license.
