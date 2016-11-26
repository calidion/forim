# forim [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> 一个基于node的论坛, im系统, 简称forim


## 介绍

Node Forum Im 是基于[node club](https://github.com/cnodejs/nodeclub)修改的社区系统。
未来将会移除全部的nodeclub代码。
实例布署在[forum.webfullstack.com](http://forum.webfullstack.me)上


## 目标

一个只提供API的论坛IM系统，支持cors，支持多客户端访问，支持Socket.io。

1. 支持个人与个人的交流
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

QQ群：312685910

## 最新改进

使用gulp取代Makefile  
删除Loader，使用gulp-less来生成结果文件  
重新组织了目录结构  
添加代码覆盖率  
优化了代码，添加ESLINT  

## 支持Nodejs版本

全部主要版本(V6,V5,V4,V0.12,V0.10)
V0.10将慢慢不再支持。


## 参数配置

forim是基于参数配置的论坛系统，所以在安装前需要进行参数配置。然后直接下载源码运行即可。
配置参数在lib/config.js文件里可以找到。

能shell里需要配置：
FORIM_XXX
这样的参数。

## 安装部署

1. 安装 `Node.js[必须]` `MongoDB[必须]` `Redis[必须]`
2. 启动 MongoDB 和 Redis
3. `$ npm i` 安装 node weixin forum 的依赖包
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
