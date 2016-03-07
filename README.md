# Node Forum Im
[![Build Status][travis-image]][travis-url]  [![Dependency Status][david-image]][david-url]  [![Coverage percentage][coverage-image]][coverage-url] [![node version][node-image]][node-url]


Node Forum IM

## 介绍

Node Forum Im 是基于[node club](https://github.com/cnodejs/nodeclub)修改的社区即时通讯系统。
实例布署在[forum.node-weixin.com](http://forum.node-weixin.com)

## 目标

一个只提供API的论坛IM系统，支持cors，支持多客户端访问，支持Socket.io。

1. 支持个人与个人的交流
2. 支持围绕话题讨论,即标签化话题，去中心化
3. 支持订阅自己喜欢的话题
4. 开发者可以自己维护

## 技术栈

服务器： Node.js, C/C++
客户端：
  1. Web: angular 2.x+
  2. 手机： PhoneGap/Cordova + Web
  3. 桌面： Electron.js + Web

## 支持与交流

QQ群：312685910

## 最新改进

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

[travis-image]:https://img.shields.io/travis/calidion/forim.svg
[travis-url]: https://travis-ci.org/calidion/forim
[coverage-image]: https://img.shields.io/coveralls/calidion/forim.svg
[coverage-url]: https://coveralls.io/r/calidion/forim?branch=master
[david-image]: https://img.shields.io/david/calidion/forim.svg
[david-url]: https://david-dm.org/calidion/forim
[node-image]: https://img.shields.io/badge/node.js-%3E=_4.2-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
