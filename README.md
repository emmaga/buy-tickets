# buy_tickets_el

> A Vue.js project

## 文件命名和分类原则
* 骆驼式命名法
* 页面级别的组件放在pages文件夹
  * 每个单独的页面组件放在一个文件夹内，后期与此文件相关的资源或组件都可以放在一起，方便维护
* 公用组件放在components文件夹
  * 每个组件一个文件夹
* 公用样式、js、图片放在common文件夹
* Vuex 相关代码分割到模块中：
  * 应用层级的状态应该集中到单个 store 对象中。
  * 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。
  * 异步逻辑都应该封装到 action 里面。
  * 如果你的 store 文件太大，只需将 action、mutation、和 getters 分割到单独的文件

## Directory

```
├─config
│   └─index.js     修改本地测试端口
│
└─src
    │  main.js        项目入口
    │
    ├─common          公用文件
    │  ├─js
    │  │  ├─filters   过滤器
    │  │  └─store.js  本地存储
    │  │
    │  ├─img          图片
    │  │
    │  └─stylus       全局样式
    │
    ├─components      公用组件
    │  ├─header       页头
    │  └─nav          导航
    │
    ├─http            ajax
    │
    ├─router          路由
    │
    ├─store           vuex文件
    │
    └─pages           页面组件
        ├─login       登录
        ├─home        主页
        ├─ticketList  下单页
        └─orderList   订单页

```

## Build Setup

克隆远程库
```
git clone https://github.com/raythunder/buy_tickets_el.git
```
进入项目目录
```
cd buy_tickets_el
```
安装依赖
```
npm install
```
打包生成 (已经打包dist目录，可以省略)
```
npm run build
```
## Todo

* [x] 登录页
  * [x] 表单验证
  * [x] 登录失败、成功提示
* [ ] 主页
  * [x] 登录退出
  * [ ] 密码修改
* [x] 下单页
  * [x] 可售商品查询
  * [x] 下单弹出
* [ ] 订单页
  * [x] 订单查询
  * [x] 游客信息弹出
  * [ ] 退票弹出

* [ ] 拆分vuex代码

