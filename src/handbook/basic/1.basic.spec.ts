/**
 * 在 JS 中这段代码是合法的，你知道一定会抛错，因为 message 不是一个 fn
 * 替代方式就是使用静态类型系统而非动态类型系统
 */
test(`The Basics`, () => {
  const message = 'Hello World!';
  // message()
})

/**
 * 调用一个不能调用的东西应该报错？对吧，但 JS 不会，他返回 undefined
 * 静态语言需要标记出哪些代码是一个错误，TS 会告诉你 user.location 是不存在的
 */
test(`Non-exception`, () => {
  const user = {
    name: "Danial",
    age: 26,
  }
  // console.log(user.location)

  // 同样的，还方便了函数书写，规避了许多基本的逻辑错误
  user.name.toLowerCase(); // 错误的 -> user.name.toLowarCase()
  const b = Math.random() < 0.5; // 错误的 -> const b = Math.random < 0.5;
})

/**
 * 类型工具：类型检查器有类型信息，可以帮助我们列出想要的属性，也就是代码补全
 */
test(`Types for Tooling`, () => {
  const auth = (req: Request, res: Response) => {
    const b = req.body; // 当你输入 req. 的时候，会列出后续可能的信息
  }
})

/**
 * TSC -> the Typescript Compiler
 */
test(`the Typescript Compiler`, () => {
  const usage = `
    使用 npm install -g typescript 安装 tsc 编辑器，我们可以用它上手编写 ts 文件
    执行 tsc something.ts 后就会生成一个 something.js
    tsc 会把 TS 文件编译成一个纯 JS 文件
  `
})

/**
 * TSC 的编译选项（参数），即报错时仍然产出文件
 * 当你从 JS 迁移到 TS 时，原来的代码是可以运行的，TS 也就没必要阻止你了！
 * 如果你想要 TS 更加严厉一点，可以用 noEmitOnError 编译选项
 */
test(`Emitting with Errors`, () => {
  const usage = `
    tsc --noEmitOnError hello.ts
  `
})

/**
 * 用 TS 声明类型
 * 我们可以给 greet 函数的 2 个参数加上签名（Signature）
 * 这样 greet 被错误调用时就知道了
 */
test(`Explicit Types`, () => {
  const greet = (person: string, date: Date) => {
    console.log(`Hello ${person}, today is ${date}`)
  }

  // 我们不总需要写注解，很多时候 TS 可以自动推断出类型
  let msg = "Hello~";
})

/**
 * 降级 Downleveling
 * 当你对 str 进行编译，结果将是 strAfterDownleveling 的形式
 * 因为 TS 默认编译成 ES6，一个 ECMAScript 非常老的版本
 * 我们也可以使用 target 参数转换成一些更新的版本，比如 tsc --target es2015 hello.ts
 * 大多数浏览器都支持 ES2015 了，除非你要兼容某些浏览器，可以安全地指定编译版本为 ES2015
 */
test(`Downleveling`, () => {
  const greet = (person: string, date: Date) => {
    const str = `Hello ${person}, today is ${date.toDateString()}!`;
    const strAfterDownleveling = "Hello " + person + ", today is " + date.toDateString() + "!";
  }
})

/**
 * 严格模式 Strictness
 * 不同用户使用 TS 会关注不同的事情，TS 默认的开发体验会帮你检查部分代码，享受 TS 的工具能力
 * 类型是可选的，推断会兼容大部分类型，对可能是 null / undefined 的值也不会强制检查
 *
 * 另一方面，这门语言提供了 严格模式 设置，你可以通过 CLI 里的 strict 配置，或者 tsconfig.json 中的 "strict": true 开关
 * 在这些设置里面，你最需要了解的是：noImplicitAny 和 strictNullChecks
 */
test(`Strictness`, () => {
  const something: any = '123' // noImplicityAny -> 阻止隐式回 any，使用更多的 TS，减少 bug
  const nullableVar = null; // strictNullChecks -> 默认情况下 null 和 undefined 可以被赋值给其他变量，忘记处理会产生相当多的 bug
})
