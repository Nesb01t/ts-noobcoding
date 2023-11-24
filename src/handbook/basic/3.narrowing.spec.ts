test(`Narrowing`, () => {
  function addPrefix(prefix: number | string, input: string) {
    // return new Array(prefix + 1).join(" ") + input;
    // 如果这样写的话，TS 会警告我们尝试对 number | string 和 number 进行相加
    if (typeof prefix === 'number') {
      return new Array(prefix + 1).join(" ") + input
    }
    return prefix + input

    /**
     * 这段代码看起来或许没什么有意思的地方，实际上 TS 做了很多事情
     * TS 试着分析使用了静态类型的值在运行时真正的类型
     * 比如 if/else，三元运算符，while 情况下的类型分析
     *
     * 在 if 中，TS 会认为 typeof prefix === number 是一种特殊形式的代码
     * 被称为 类型保护(type guard)，TS 会沿着执行时可能的路径，分析值在特定位置上最具体的类型
     *
     * 类型检查器 会考虑到这些类型保护和赋值语句，推导的过程我们成为 narrowing (收窄)
     */
  }
})

test(`typeof 类型保护(type guards)`, () => {
  // typeof 是 JS 本身提供的操作符，可以返回运行时一个值的基本类型信息
  function logValue(x: Date | string) {
    console.log(typeof x === 'string' ? x.toUpperCase() : x.toUTCString())
  }

  function printAll(strs: string | string[] | null) {
    // 这里的 typeof 是一个类型保护，TS 会分析 typeof strs === 'object' 的情况
    if (strs && typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    } else {
      // do nothing
    }
  }
})


test(`真值收窄 Truthiness narrowing`, () => {
    // 在 JS 中我们可以在条件语句中使用 && || ! 等，像 if 语句不需要条件的结果总是 boolean
    function getUserOnlineMessage(numUsersOnline: number) {
      // JS 会做隐式类型转换，像 0 '' null undefined NaN false 这些值都会被转换成 false
      // 当然你也可以使用 Boolean 或者 !! 来显式转换
      if (numUsersOnline) {
        return `There are ${numUsersOnline} online now!`
      }
      return `Nobody's here.`
    }
  }
)

test(`等值收窄 Equality narrowing`, () => {
  // TS 会分析 == 和 != 操作符，如果操作数的类型是 string 或者 number，就会认为是一个等值收窄
  function printAll(strs: string | string[] | null) {
    if (strs != null) {
      if (typeof strs === "object") {
        for (const s of strs) {
          console.log(s);
        }
      } else if (typeof strs === "string") {
        console.log(strs);
      }
    }
  }
})

test(`in 操作符收窄`, () => {
  type Fish = { swim: () => void }
  type Bird = { fly: () => void }
  type Human = { swim?: () => void, fly?: () => void }

  function move(animal: Fish | Bird | Human) {
    if ("swim" in animal) {
      return animal // Fish | Human
    }
    return animal // Bird | Human
  }
})

test(`instanceof 收窄`, () => {
  function logValue(x: Date | string) {
    if (x instanceof Date) {
      console.log(x.toUTCString())
    } else {
      console.log(x.toUpperCase())
    }
  }
})

test(`赋值语句 Assignments`, () => {
  let x = Math.random() < 0.5 ? 10 : "hello world!"
  // x: string | number
})

test(`控制流分析 Control flow analysis`, () => {
  function prefix(prefix: number | string, input: string) {
    if (typeof prefix === 'number') {
      return new Array(prefix + 1).join(" ") + input
    }
    return prefix + input
  }

  /**
   * 在第一个 if 语句中，因为有 return 语句
   * 所以 TS 就可以判断出在剩余的部分 return prefix + input 中
   * 如果 prefix 类型是 number 就无法到达这里了(unreachable)
   * 所以在剩余的部分中就会把 number 类型从 number | string 中排除掉
   */
})

test(`类型判断式 type predicates`, () => {
  function isNum(x: number | string): x is number {
    return typeof x === 'number'
  }

  /**
   * 在这个例子中，x is number 就是一个类型谓词(type predicate)
   * 但 x 必须是当前函数的参数名
   * 当 isNum 被调用，TS 就可以进行收窄了
   */

  let x: number | string = "12";
  if (isNum(x)) {
    /**
     * 当进行收窄的时候，如果所有可能的类型都穷尽了
     * TS 会使用 never 类型来表示一个不可能存在的状态
     */
    console.log(x) // x: number -> never
  } else {
    console.log(x.toUpperCase()) // x: string
  }
})

test(`可辨别的联合类型 Discriminated unions`, () => {
  interface Circle {
    kind: "circle"
    radius: number
  }

  interface Square {
    kind: "square"
    sideLength: number
  }

  type Shape = Circle | Square

  function getArea(shape: Shape) {
    // return Math.PI * shape.radius ** 2 这样仍然会报错
    if (shape.kind === "circle") {
      // 通过 kind 收窄就不会了！即使判断的不是类型而是联合内部属性
      return Math.PI * shape.radius ** 2
    }
    return shape.sideLength ** 2
  }
})

test(`穷举检查 Exhaustiveness checking`, () => {
  /**
   * never 类型可以赋值给任何类型，然而没有类型可以赋值给 never
   * 所以你可以在 switch 语句中做一个 never 穷举检查
   */
  interface Circle {
    kind: "circle"
    radius: number
  }

  interface Square {
    kind: "square"
    sideLength: number
  }

  type Shape = Circle | Square

  function getArea(shape: Shape) {
    switch (shape.kind) {
      case "circle":
        return Math.PI * shape.radius ** 2
      case "square":
        return shape.sideLength ** 2
      default:
        const _exhaustiveCheck: never = shape // never
        return _exhaustiveCheck
    }
  }

  /**
   * 如果你给 Shape 再联合一个 Triangle 那么 default 就会报错了
   * 因为他会收窄到 Triangle 而不是 never！
   */
})