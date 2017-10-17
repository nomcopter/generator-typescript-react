import * as _ from 'lodash';
import * as path from 'path';
import * as Base from 'yeoman-generator';

class GeneratorTypescriptReact extends Base {
  private humanReadableName: string;
  private kebabCaseName: string;

  prompting() {
    const destinationName = path.basename(this.destinationRoot());
    return this.prompt([{
      type: 'input',
      name: 'kebab',
      message: 'What is the Package Name for this app?',
      default: _.kebabCase(destinationName),
    }, {
      type: 'input',
      name: 'human',
      message: 'What is the Human-Readable Name for this app?',
      default: _.startCase(destinationName),
    }])
      .then(answers => {
        this.kebabCaseName = answers.kebab;
        this.humanReadableName = answers.human;
      });
  }

  writing() {
    const allTemplateData = {
      kebabCaseName: this.kebabCaseName,
      humanReadableName: this.humanReadableName,
    };

    this._copyWithoutTemplating([
      '.editorconfig', '.npmignore', 'circle.yml', 'LICENSE',
      'tsconfig.json', 'tsconfig-build.json', 'tslint.json',
    ]);
    this._copyWithTemplating(allTemplateData, ['.gitignore', 'package.json', 'README.md']);

    this._copyWithoutTemplating(['demo.less', 'index.tsx'], 'demo');
    this._copyWithTemplating(allTemplateData, ['Demo.tsx'], 'demo');

    this._copyWithTemplating(allTemplateData, ['index.ts'], 'src');

    this._copyWithoutTemplating(['index.less'], 'styles');

    this._copyWithoutTemplating(['mocha.opts', 'registerTsNode.js'], 'test');
    this._copyWithTemplating(allTemplateData, ['spec.ts'], 'test');

    this._copyWithoutTemplating(['base.ts', 'bundle.ts', 'constants.ts', 'hot.ts'], 'webpack');
    this._copyWithTemplating(allTemplateData, ['index-template.html'], 'webpack');
  }

  install() {
    this.spawnCommandSync('yarn', ['install'], { cwd: this.destinationRoot() });
  }

  end() {
    this.log();
    this.log('To start devving, use webpack-dev-server:');
    this.log('  yarn start');
  }

  private _copyWithTemplating(templateData: object, templateNames: string[], directory: string = '.') {
    templateNames.forEach(filename => {
      this.fs.copyTpl(
        this.templatePath(path.join(directory, '_' + filename)),
        this.destinationPath(path.join(directory, filename)),
        templateData,
      );
    });
  }

  private _copyWithoutTemplating(templateNames: string[], directory: string = '.') {
    templateNames.forEach(filename => {
      this.fs.copy(
        this.templatePath(path.join(directory, '_' + filename)),
        this.destinationPath(path.join(directory, filename)),
      );
    });
  }
}

export = GeneratorTypescriptReact;
