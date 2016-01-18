# [![build status][travis-image]][travis-url][![Coverage Status][coverage-image]][coverage-url][![David deps][david-image]][david-url][![node version][node-image]][node-url]

node weixin forum

==================

## 介绍

node weixin forum 是基于node club的社区系统。
布署在[forum.node-weixin.com](http://forum.node-weixin.com)

## 安装部署

1. 安装 `Node.js[必须]` `MongoDB[必须]` `Redis[必须]`
2. 启动 MongoDB 和 Redis
3. `$ make install` 安装 node weixin forum 的依赖包
5. `$ make test` 确保各项服务都正常
6. `$ node app.js`
7. visit `http://localhost:3000`
8. done!
```

## 测试

跑测试

```bash
$ make test
```

跑覆盖率测试

```bash
$ make test-cov
```

## 贡献

有任何意见或建议都欢迎提 issue，或者直接提给 [@alsotang](https://github.com/alsotang)

## License

MIT

[travis-image]: https://img.shields.io/travis/node-weixin/nodeweixinforum.svg
[travis-url]: https://travis-ci.org/node-weixin/nodeweixinforum
[coverage-image]: https://img.shields.io/coveralls/node-weixin/nodeweixinforum.svg
[coverage-url]: https://coveralls.io/r/node-weixin/nodeweixinforum?branch=master
[david-image]: https://img.shields.io/david/node-weixin/nodeweixinforum.svg
[david-url]: https://david-dm.org/node-weixin/nodeweixinforum
[node-image]: https://img.shields.io/badge/node.js-%3E=_4.2-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
