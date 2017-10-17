import * as _ from 'lodash';
import * as path from 'path';
import * as Base from 'yeoman-generator';

export default class GeneratorTypescriptReact extends Base {
  private readonly destinationName: string;
  private readonly copyWithoutTemplating: (templateNames: string[], directory?: string) => void;
  private readonly copyWithTemplating: (templateData: object, templateNames: string[], directory?: string) => void;

  private humanReadableName: string;
  private kebabCaseName: string;

  constructor() {
    super(...arguments);

    this.destinationName = path.basename(this.destinationRoot());

    this.copyWithTemplating = (templateData, templateNames, directory = '.') => {
      templateNames.forEach(filename => {
        this.fs.copyTpl(
          this.templatePath(path.join(directory, '_' + filename)),
          this.destinationPath(path.join(directory, filename)),
          templateData,
        );
      });
    };

    this.copyWithoutTemplating = (templateNames, directory = '.') => {
      templateNames.forEach(filename => {
        this.fs.copy(
          this.templatePath(path.join(directory, '_' + filename)),
          this.destinationPath(path.join(directory, filename)),
        );
      });
    };
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'kebab',
      message: 'What is the Package Name for this app?',
      default: _.kebabCase(this.destinationName),
    }, {
      type: 'input',
      name: 'human',
      message: 'What is the Human-Readable Name for this app?',
      default: _.startCase(this.destinationName),
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

    this.copyWithoutTemplating([
      '.editorconfig', '.npmignore', 'circle.yml', 'LICENSE',
      'tsconfig.json', 'tsconfig-build.json', 'tslint.json',
    ]);
    this.copyWithTemplating(allTemplateData, ['.gitignore', 'package.json', 'README.md']);

    this.copyWithoutTemplating(['demo.less', 'index.tsx'], 'demo');
    this.copyWithTemplating(allTemplateData, ['Demo.tsx'], 'demo');

    this.copyWithTemplating(allTemplateData, ['index.ts'], 'src');

    this.copyWithoutTemplating(['index.less'], 'styles');

    this.copyWithoutTemplating(['mocha.opts', 'registerTsNode.js'], 'test');
    this.copyWithTemplating(allTemplateData, ['spec.ts'], 'test');

    this.copyWithoutTemplating(['base.ts', 'bundle.ts', 'constants.ts', 'hot.ts'], 'webpack');
    this.copyWithTemplating(allTemplateData, ['index-template.html'], 'webpack');
  }

  install() {
    this.spawnCommandSync('yarn', ['install'], { cwd: this.destinationRoot() });
  }
}
