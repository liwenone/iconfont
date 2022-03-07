#!/usr/bin/env node
function run(argv) {
  if (argv[0] === '--config' && argv[1]) {
    const iconfont = require('../index')
    iconfont.run(argv[1])
  } else {
    console.log('!!!缺少配置文件!!!')
  }
}

run(process.argv.slice(2))