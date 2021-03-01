# ggb-game-server
## 项目介绍
### 简介 
该项目是一个基于Node.js平台中koa框架开发完成的分布式游戏服务器框架,对应有一个U3D客户端框架[koa-game-client](https://github.com/GrayGuardian/ggb-game-client)
### 架构设计
#### 架构图
![](./res/koa-game-server2021-03-01_12-02-07.png)
#### 基础服务器
- web-server - Web服务器
  - 游戏前后台网站放置
  - 游戏在线更新资源下载
- http-server - Http服务器
  - 管理游戏登录/注册/选择区服等http请求处理
  - 管理游戏前后台网站所需http请求
- center-server	- 中心服务器
  - 负责框架内各服务器之间数据的通信转发
- connect-server - 网关服务器
  - 管理游戏客户端建立的socket连接
- game-server - 游戏逻辑服务器
  - 管理具体的游戏逻辑
#### 工作流
- 客户端进入游戏前的登录、选择角色等HTTP请求，发送至`http-server`实现通信  
- 进入游戏时将发送Token值至`connect-server`进行验证，验证成功将建立socket连接  
- 游戏业务逻辑将请求至`connect-server`，然后通过`center-server`转发至`game-server`,在`game-server`处理具体逻辑或者再次转发至战斗、聊天等更细分的游戏服务器，再通过`center-server`回发至`connect-server`，最后发送至客户端完成通信。
## 入门指南
 
这些说明将为您提供项目的副本，并在您的本地机器上运行，用于开发和测试。有关如何在活动系统上部署项目的说明，请参阅部署。
 
### 环境依赖

- 发布环境无要求，开发环境为 Windows

- 项目运行平台为 [node.js](https://nodejs.org/)

- 数据库使用 [mysql](https://www.mysql.com/)、[redis](https://redis.io/)

- 工具类采用 bat批处理、[python2](https://www.python.org/) 编写
 
### 安装
 
1. 通过github下载项目  
`https://github.com/GrayGuardian/koa-game-client.git`
2. 进入项目文件夹，命令行安装依赖库
`npm i`
3. mysql数据库运行`./db.sql`数据库语句创建表结构及数据
4. 安装protobuf-python
  - 命令行进入 `./tool/protobuf/plugins/protobuf-python`
  - 输入命令 `python setup.py build` `python setup.py install`
  - 双击运行 `./tool/protobuf/pb.bat` 无报错则表示安装成功
5. 修改项目配置 
 - 服务器配置：`./common/config/server.json`
 - redis数据库配置：`./common/config/redis.json`
 - mysql数据库配置：`./common/config/mysql.json`
6. 修改工具配置
 - 协议导出批处理程序 `./tool/protobuf/pb.bat`
 - 数据模板导出python程序 `./tool/template/build.py`
 
## 运行测试
 
###快速启动

- 双击 `./start.bat` 批处理程序

###单个启动

- 命令行输入 `node ./[server-name]/app [server-order]`  
 - 例如：`node ./web-server/app`、`node ./game-server/app 0`

此处仅展示如何快速启动项目测试，具体配置方式请看下方项目部署
 
## 项目部署
 
- 双击 `./tool/protobuf/pb.bat` 导出协议  

- python运行 `./tool/template/build.py` 导出数据模板  

- 修改 `./common/config/server.json` 字段`Master`中的服务器配置为部署环境IP与端口号

- 修改 `./common/global.js` 字段名 `global.PRO_ENV = 'Master';`  

- 若需要使用`./start.bat`快速启动所有服务器，则修改其中的`SERVER_CONFIG.Type SERVER_CONFIG.Count`

最后启动所有服务器，即可完成部署
 
## 内置
 
* [koa](https://github.com/koajs/koa) - 项目所使用的Web框架
* [protobuf](https://github.com/protocolbuffers/protobuf) - protobuf协议导出
* [protoc-gen-lua](https://github.com/sean-lin/protoc-gen-lua) - protobuf lua版本协议导出插件

## 抗压扩容
1. 添加服务器
  - 部署更多的`center-server`、`connect-server`、`game-server`
  - 将场景、聊天等数据量交互大的游戏逻辑独立出`scene-server`、`chat-server`等服务器，通过`center-server`转发，与`game-server`进行通信处理，再转发至`connect-server`,继而与客户端完成通信
2. 配置更新
  - 更新服务器配置：`./common/config/server.json`
  - 负载均衡管理：`./common/config/server_config.js`中的`get[ServerName]Config`

## 常用API
1. rpc_mgr: 封装一些服务器之间的rpc业务逻辑通信，是主要的跨服通信手段  

2. center_mgr: 通过中心服务器转发数据至其他服务器
  - rpc 转发  

  - rpcAsync 异步转发  

3. socket_channel：管理socket连接分组，批量回发等，每个socket连接时，均会添加分组`uid=[uid]` `aid=[aid]` `pid=[pid]` `[socketid]`,因此也用于单用户回发,仅存在于`connect-server`，一般通过`rpc_mgr`封装使用  

  - send 发送数据  

  - kick 踢出用户 可携带一个错误代码  

  - genError 发送一个逻辑层错误代码 如密码错误等  

4. [Model]：数据模型，可以有效的减少数据库读写压力，实体存在于`game-server`的`model_mgr`中,一般通过`rpc_mgr`封装使用，可保证所有服务器数据模型一致  

	- [Model].baseInfo 基础数据 可通过`get_[field]` `set_[field]`来读写

	- [Model].upDBToData 从数据库更新缓存数据  

	- [Model].upDataToDB 从缓存更新数据库数据  

	- [Model].upClientData 更新数据到客户端  

5. tpl：管理模板类
