# forim [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> 一个基于node的论坛, im系统, 简称forim


## 介绍

xiv.im 是基于vig框架编写的社区IM系统。
已经移除后端全部的nodeclub代码，目前只保留有模板的代码。
实例布署在[forum.webfullstack.com](http://forum.webfullstack.me)上


## 目标

一个只提供API的论坛IM系统，支持cors，支持多客户端访问，支持Socket.io。

1. 支持个人与个人的交流，支持群组交流，支持基于标签的交流
2. 支持围绕话题讨论,即标签化话题，去中心化
3. 支持订阅自己喜欢的话题、作者
4. 支持系统之间共享用户与数据
5. 全面的API设计，基于EGG API（未来会重命名为vig api)
6. 企业服务中立，优先支持用户多的以及价值观先进的

## 技术栈 

服务器技术栈： Node.js，[vig](https://github.com/calidion/vig)轻量级Web框架

客户端：
  1. Web: angular 2.x+
  2. 手机： PhoneGap/Cordova + Web
  3. 桌面： Electron.js + Web

## 支持与交流

QQ群：312685910，

## 最新改进

使用vig框架加速开发，采用waterline驱动数据库，可以方便用户自由的选择低层的数据库。

## 支持Nodejs版本

V4.0+

## 参数配置

forim是基于参数配置的论坛系统，所以在安装前需要进行参数配置。然后直接下载源码运行即可。
配置参数在lib/config.js文件里可以找到。

能shell里需要配置：
FORIM_XXX
这样的参数。

## 安装部署

说明：论坛使用的是mongodb数据库

1. 安装 `Node.js[必须]` `Redis[必须]` `数据库(MongoDB, Mysql, PostGRE等)`
2. 启动 数据库 和 Redis
3. `$ npm i` 安装 xiv.im 的依赖包
5. `$ gulp` 确保各项服务都正常
6. `$ node lib/index.js`
7. visit `http://localhost:3000`
8. 完成

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

本项目的源代码已经与原项目完全没有关系。

## License

Apache-2.0 © [calidion](blog.3gcneta.com)  

[npm-image]: https://badge.fury.io/js/forim.svg
[npm-url]: https://npmjs.org/package/forim
[travis-image]: https://travis-ci.org/calidion/forim.svg?branch=master
[travis-url]: https://travis-ci.org/calidion/forim
[daviddm-image]: https://david-dm.org/calidion/forim.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/forim
[coveralls-image]: https://coveralls.io/repos/calidion/forim/badge.svg
[coveralls-url]: https://coveralls.io/r/calidion/forim
