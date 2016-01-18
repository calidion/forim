# Node Weixin Forum [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

Node Weixin Forum

## 介绍

Node Weixin Forum 是基于[node club](https://github.com/cnodejs/nodeclub)裁剪的社区系统。
布署在[forum.node-weixin.com](http://forum.node-weixin.com)

1. 修改后的版本引入了config文件，你只要修改一下config文件的参数就可以基本上部署成功
2. 修改了测试用例，使你的定制不会出现问题
3. 却除了广告，系统更加的纯粹
4. 删除了部分非开源的软件。如JPUSH的代码。


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

## 说明

由于差异过大，这个项目的源代码可能不会再与原项目合并，

为了真正的使用开源软件，本项目的消息推送功能将采用socket.io来实现。

## License

MIT

[travis-image]:https://img.shields.io/travis/node-weixin/nodeweixinforum.svg
[travis-url]: https://travis-ci.org/node-weixin/nodeweixinforum

[coverage-image]: https://img.shields.io/coveralls/node-weixin/nodeweixinforum.svg

[coverage-url]: https://coveralls.io/r/node-weixin/nodeweixinforum?branch=master

[david-image]: https://img.shields.io/david/node-weixin/nodeweixinforum.svg

[david-url]: https://david-dm.org/node-weixin/nodeweixinforum

[node-image]: https://img.shields.io/badge/node.js-%3E=_4.2-green.svg?style=flat-square

[node-url]: http://nodejs.org/download/
