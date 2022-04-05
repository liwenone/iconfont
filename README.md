# ICONFONT生成工具

可将指定目录下的svg图片转成iconfont，本工具适合小项目使用，尤其是单人开发的项目

### 安装
``` bash
npm i @liwenone/iconfont
```

### 配置模板

1. 在项目根路径下建立目录结构如下：
```
iconfont
  output
  source
  config.json
```

2. 在config.json中配置相关路径
``` bash
{
  "outputDir": "./iconfont/output", // 输出目录，输出可预览icon的html文件
  "inputDir": "./iconfont/source", // svg图标文件目录
  "styleOutputPath": "./src/components/Icon/index.scss" // 样式文件输出路径，后缀可自行调整，比如css、less等
}
```

3. 在package.json中，添加构建命令
``` bash
"script": {
  "iconfont": iconfont --config ./iconfont/config.json
}
```
