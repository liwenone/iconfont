const fontCarrier = require('./lib/index');
const fs = require('fs');
const path = require('path');


const R = (p, ...other) => {
  if (p.startsWith('/') || p.startsWith('\\')) {
    return path.resolve(p, ...other)
  } else {
    return path.resolve(process.cwd(), p, ...other)
  }
}


function createFont(options, iconList) {
  const font = fontCarrier.create({
    id: options.fontFamily,
  });

  font.setFontface({
    fontFamily: options.fontFamily,
  });

  const fileList = fs.readdirSync(options.inputDir);

  fileList.forEach((file, index) => {
    if (file.endsWith('.svg')) {
      const filePath = R(options.inputDir, file);

      const glyphName = file.replace(/\.svg$/, '');
      const id = (options.startUnicode + index).toString(16);

      iconList.push({ id, glyphName });

      font.setSvg(`&#x${id}`, {
        glyphName,
        svg: fs.readFileSync(filePath).toString(),
      });
    }
  });

  font.output({
    path: options.fontOutputPath,
  });
}


function createStyleFile(options, iconList) {
  const fontContent = fs.readFileSync(options.fontOutputPath);
  const fontBase64 = Buffer.from(fontContent).toString('base64');

  const style = [
    `@font-face {
  font-family: "${options.fontFamily}";
  src: url("data:font/ttf;charset=utf-8;base64,${fontBase64}") format("truetype");
}

.iconfont {
  font-family: ${options.fontFamily} !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`,
    ...iconList.map(e => (`
.icon-${e.glyphName}::before {
  content: "\\${e.id}";
}
`
    ))];

  fs.writeFileSync(options.styleOutputPath, style.join(''));
}


function createPreviewFile(options, iconList) {
  const styleContent = fs.readFileSync(options.styleOutputPath);

  // 生成html，用于预览效果
  const divList = [];
  iconList.forEach((item) => {
    const { glyphName } = item;
    divList.push(`
      <div class="item">
        <div class="iconfont icon-${glyphName}"></div>
        <div class="item-name">${glyphName}</div>
      </div>
    `);
  });

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <title>iconfont 预览</title>
    <style>${styleContent}</style>
    <style>
      .container {
        display: flex;
        flex-wrap: wrap;
      }

      .item {
        width: 200px;
        height: 60px;
        display: flex;
        align-items: center;
        border-radius: 12px;
        padding: 10px;
        box-sizing: border-box;
        background-color: #e8f1f4;
        margin: 10px;
      }

      .item-name {
        margin-left: 12px;
        display: flex;
      }

      [class^='icon-'] {
        font-size: 32px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      ${divList.join('')}
    </div>
  </body>
</html>
`;
  fs.writeFileSync(options.previewOutputPath, htmlTemplate);
}


const defaultOptions = {
  fontFamily: 'iconfont',
  startUnicode: 0xe900,
  inputDir: './source',
  outputDir: './output',
  styleOutputPath: './iconfont.css',
  fontOutputPath: './tmp/iconfont.ttf',
  previewOutputPath: './preview.html',
}

function run(userOptionsPath) {
  const userOptions = require(R(userOptionsPath))

  const mergeOptions = {
    ...defaultOptions,
    ...userOptions
  }

  const options = {
    ...mergeOptions,
    inputDir: R(mergeOptions.inputDir),
    outputDir: R(mergeOptions.outputDir),
    styleOutputPath: userOptions.styleOutputPath ? R(mergeOptions.styleOutputPath) : R(mergeOptions.outputDir, mergeOptions.styleOutputPath),
    fontOutputPath: R(__dirname, defaultOptions.fontOutputPath),
    previewOutputPath: R(mergeOptions.outputDir, mergeOptions.previewOutputPath)
  }

  const iconList = []
  createFont(options, iconList)
  createStyleFile(options, iconList)
  createPreviewFile(options, iconList)

  console.log('iconfont生成成功！')
}

module.exports = {
  run
}