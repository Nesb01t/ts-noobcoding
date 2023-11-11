## 工程用途

| 用途       | 情景                                                                          |
|----------|-----------------------------------------------------------------------------|
| 做算法题     | 使用 `c++`、`java` 当然很好，但前端新手写 `ts` 可以加深理解，`js` 语法松散，无论项目和做算法题都可以尝试用 `ts`      |
| 熟悉 ts 基础 | 仓库环境涉及 `jest`、`babel` 的常见使用场景，可以在此基础上添加 `express`、`canvas` 类似框架直接搭建成后端项目、服务 |

## 脚手架教程

### 构建项目

首先 `clone` 项目到本地，进行 `node` 相关初始化后，使用 `webstorm` 或 `vscode` 编辑代码

- 单元测试：在 `/src/tests` 文件夹中，通过 `pnpm test <fileName>` 进行某个文件的单元测试，若置空则会进行所有 `.spec.ts`
  文件的测试
- 全局类型定义：在项目根目录的 `global.d.ts` 中

## 搭建过程

> 整个项目搭建的流程记录，仅供参考

1. 初始化 node.js 和 pnpm
2. 安装 ts 支持
    - `pnpm add typescript --save-dev`
    - `npx tsc --init` 初始化 tsconfig.json
3. 安装 jest 并支持 type
    - `pnpm add jest @types/jest --save-dev`
4. node 环境下一般仅支持 cjs 模块，通过 babel 配置 es 模块，并支持 type
    - `pnpm add babel-jest @babel/core @babel/preset-env --save-dev`
    - `pnpm add @babel/preset-typescript --save-dev`
5. 初始化 babel.config.js 配置与 node 版本兼容的 babel
   ```js
   module.exports = {
      presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
      ],
   };
   ```
6. 添加 node (package.json) -> scripts
   ```
   "scripts": {
      "test": "jest"
   }
   ```
7. 根据你的习惯，添加 src/utils、src/tests 等文件夹，开始编码