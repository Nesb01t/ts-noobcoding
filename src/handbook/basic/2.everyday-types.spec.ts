test(`原始类型 The primitives`, () => {
  // String Number 也是合法的，但他们是一种非常少见的特殊内置类型
  const str: string = 'hello'
  const num: number = 42
  const b: boolean = true
})

test(`数组 Array`, () => {
  const nums: number[] = [1, 2, 3]
  const arr: Array<number> = [1, 2, 3] // 这种写法是一样的，泛型 T<U>
})

test(`any 类型`, () => {
  const obj: any = {x: 0}
  obj.foo()
  // 当你不想写一个很长的类型代码，只是希望 TS 知道代码没有问题就可以用 any
  // 如果你开启了 noImplicityAny，被隐式推断为 any 时 TS 就会报错
})

test(`显示标注类型`, () => {
  const str: string = "123"; // 显示指定
  const inferredStr = "123"; // 隐式推断
})

test(`函数 Functions`, () => {
  // 函数参数有了注解就会检查实参
  function greet(name: string) {
    console.log(name)
  }

  greet("42");

  // 添加返回值的类型注解，如果不添加当然也是会推断的！
  function getNum(): number {
    return 26;
  }

  // 匿名函数
  // TS 会注意到 s 实际上是 string 类型，自动推断并为你提示 string 类型可实现的方法
  const names = ['a', 'b', 'c']
  names.forEach((s) => {
    console.log(s.toUpperCase())
  })
})

test(`对象类型 Object types`, () => {
  // 除了 primitive type, 最常见的类型，对象里面可以用 ; 分割也可以用 , 分割
  const pt: { x: number, y: number } = {x: 1, y: 2}

  // 可选属性, 加一个 ? 就代表了可选
  // 如果你获取一个不存在的属性就会得到 undefined，所以使用中可能要检查一下
  const obj: { first: number, last?: number } = {first: 12}
})

test(`联合类型 Union types`, () => {
  // defining a union type，一个联合类型是指 值可能为其中的一种，每个类型都是联合类型的成员 members
  function printId(id: number | string) {
    console.log(id)
  }

  printId(12);
  printId("hello")

  // working with union types
  function printUpperId(id: number | string) {
    // console.log(id.toUpperCase()) 这样写当然是不成立的了，TS 会要求你做的事情对每个联合的成员有效

    // 正确的写法是使用 typeof 收窄类型
    console.log(typeof id === 'string' ? id.toUpperCase() : id)
  }

  // 另一个收窄类型的例子
  function welcomePeople(x: string | string[]) {
    console.log(Array.isArray(x) ? x.join(' and ') : x);
  }
})

test(`类型别名 Type aliases`, () => {
  // 你可以用 type 来声明一个类型别名 type aliases
  type Point = { x: number, y: number }

  function printCoord(pt: Point) {
    console.log(`${pt.x}, ${pt.y}`)
  }

  printCoord({x: 100, y: 200})

  // 联合类型也当然是有效的
  type ID = number | string
})

test(`接口 Interface`, () => {
  // 如果你喜欢探索性的使用，那就使用 interface，直到你需要 type 的特性
  interface Point {
    x: number,
    y: number
  }

  // 类型别名和接口非常相似，两者的关键区别是：别名本身无法添加新属性，而接口是可以拓展的
  interface IAnimal {
    name: string
  }

  interface IBear extends Animal {
    honey: boolean
  }

  type Animal = { name: string }
  type Bear = Animal & { honey: boolean }

  // interface 可以对一个已经存在的接口添加新字段
  // type 创建后就不能再改变了
  interface Window {
    title: string
  }

  interface Window {
    num: number
  }

  const win: Window = {num: 12, title: "hello"}
})

test(`类型断言 Type Assertions`, () => {
  // 当你知道 main-canvas 是一个 CanvasElement 但 TS 不知道
  // 你就可以使用类型断言了，像类型注解一样，类型断言也会被编译器移除，但不会影响任何运行时的行为
  const myCanvas = document.getElementById('main-canvas') as HTMLCanvasElement
  // 当然使用尖括号语法也是可以的
  const anotherCanvas = <HTMLCanvasElement>document.getElementById('main-canvas')

  // TS 只允许类型断言转换为一个更具体或者更不具体的类型
  // 有的时候这条规则会显得保守，组织了你原本有效的类型转换，你可以使用双重断言
  const x = '123' as any as number
})

test(`字面量类型 literal types`, () => {
  let changingStr = "hello" // 类型为 string
  const constStr = "hello" // 类型为 字面量类型 "hello"

  // 字面量类型本身没什么用，但联合类型就有用了，可以限定传入的字符串
  type Alignment = 'left' | 'right' | 'center'
  type Result = -1 | 0 | 1
  type Boolean = true | false // 其实 boolean 就是 true 和 false 的别名

  // 字面量推断，在 obj.counter = 2 执行之前，会假设前面可能会修改 counter，所以 counter 必须是 number 类型了
  const obj = {counter: 1}
  if (Math.random() > 0.5) obj.counter = 2

  // 可能需要改变推断结果的情况
  function handleRequest(url: string, method: "GET" | "POST") {
    console.log(url, method)
  }

  const req = {url: 'baidu.com', method: "GET"}
  // handleRequest(req.url, req.method) 这里就会显示 req.method 的类型是 string，不能变成 "GET"
  // 第一种办法是设置 req 的 method 为 method: "GET" as "GET"
  // 第二种办法是设置 const req = {url: 'baidu.com', method: "GET"} as const;
  const req1 = {url: 'baidu.com', method: "GET" as "GET"}
  const req2 = {url: 'baidu.com', method: "GET"} as const
})

test(`null & undefined`, () => {
  // strictNullChecks 如果关闭严格 null 检查，他仍可以被访问赋值，这是 JS 的 bug 主要来源
  function logSth(x: string | null) {
    if (x === null) {
      // do something
    } else {
      console.log(x.toUpperCase())
    }
  }
})

test(`非空断言 Non-null assertion operator`, () => {
  // TS 提供了一个特殊的语法，可以在不做任何检查的情况下移除 null 和 undefined
  function liveDangerously(x?: number | null) {
    console.log(x!.toFixed())
  }

  // liveDangerously() 这样写 TS 不会提示错误，但当然是运行不过的！
  liveDangerously(12)
})

test(`枚举 Enums`, () => {
  // 描述一个值可能是多个常量中的一个，这不是一个类型层面的增量，会添加到语言和运行时
  // 了解一下特性，等一等再用，如果确定要使用它可以看下面的链接
  // https://www.typescriptlang.org/docs/handbook/enums.html
  enum Direction {
    Up, Down, Left, Right
  }
})

test(`Less common primitives`, () => {
  // const big: bigint = BigInt(1000000); ES 2020 引入的新类型

  // JS 中的一个原始类型，可以创建一个全局唯一的引用
  const firstName = Symbol('name');
  const secondName = Symbol('name');
  // console.log(firstName === secondName) 永远是 false
})