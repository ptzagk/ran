const figlet = require('figlet');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const routes = require('../../routes');

const modules = {};

modules.config = {
  appDir: './',
  pagesDir: './pages',
  componentsDir: './components',
  templatesDir: './helper_scripts/templates',
  routeFile: './routes.js',
  serverFile: './server.js'
};

modules.writeRan = function writeRan(callback) {
  chalk.yellow(
    figlet.text(
      'RAN!',
      {
        verticalLayout: 'full'
      },
      (err, data) => {
        process.stdout.write('\n');
        process.stdout.write(data);
        process.stdout.write('\n');
        if (callback) callback();
      }
    )
  );
};

modules.isUsedOnDir = function isUsedOnDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    return false;
  }

  const files = fs.readdirSync(startPath);
  let isFound = false;

  for (let i = 0; i < files.length; i += 1) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      isUsedOnDir(filename, filter); // recurse
    } else if (filename.indexOf(filter) >= 0) {
      isFound = true;
    }
  }

  return isFound;
};

modules.isUsedOnRoutes = function isUsedOnRoutes(url) {
  let isFound = false;
  routes.default.forEach(route => {
    if (route.prettyUrl({}).indexOf(url) !== -1) {
      isFound = true;
    }
  });
  return isFound;
};

modules.getTempfromHandlebar = function getTempfromHandlebar(
  tempPath,
  data,
  callback
) {
  fs.readFile(tempPath, 'utf-8', (err, source) => {
    if (err) throw err;
    const template = handlebars.compile(source);
    const exportCode = template(data);

    callback(exportCode);
  });
};

module.exports = modules;
