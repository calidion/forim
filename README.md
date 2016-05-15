# forim [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> 一个基于node的论坛,im系统,简称forim

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

使用gulp取代Makefile
删除Loader，使用gulp-less来生成结果文件
重新组织了目录结构
添加代码覆盖率
优化了代码，添加ESLINT

## 安装部署

1. 安装 `Node.js[必须]` `MongoDB[必须]` `Redis[必须]`
2. 启动 MongoDB 和 Redis
3. `$ make install` 安装 node weixin forum 的依赖包
5. `$ mocha` 确保各项服务都正常
6. `$ node lib/index.js`
7. visit `http://localhost:3000`
8. done!

## 测试

```bash
$ gulp
```

跑测试

```bash
$ gulp test    # 测试代码
$ gulp less    # 生成less结果

```

跑覆盖率测试

```bash
$ gulp coveralls
```

## 说明

由于差异过大，本项目的源代码可能不会再与原项目合并

## License

Apache-2.0 © [calidion](blog.3gcneta.com)  
MIT (旧代码)


[npm-image]: https://badge.fury.io/js/forim.svg
[npm-url]: https://npmjs.org/package/forim
[travis-image]: https://travis-ci.org/calidion/forim.svg?branch=master
[travis-url]: https://travis-ci.org/calidion/forim
[daviddm-image]: https://david-dm.org/calidion/forim.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/forim
[coveralls-image]: https://coveralls.io/repos/calidion/forim/badge.svg
[coveralls-url]: https://coveralls.io/r/calidion/forim
