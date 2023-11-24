/**
 * 函数也是值，像其他值一样可以被 TS 用很多方式进行描述
 */

test(`函数类型表达式 Function type expressions`, () => {
  function printToConsole(s: string) {
    console.log(s)
  }

  function greeting(fn: (a: string) => void) {
    fn(`hello world`)
  }

  greeting(printToConsole)
  /**
   * greeting 执行了作为参数的 printToConsole，并且传入了一个字符串 hello world
   */

  type greetFunction = (a: string) => void
  // 当然我们也可以用 type alias 来定义类型
})

test(`调用签名 Call signatures`, () => {
  /**
   * JS 中函数除了被调用，自己也可以用属性
   * 如果我们要描述一个带属性的函数，可以在对象类型中写一个调用签名
   */
  type describableFunction = {
    description: string,
    (someArg: number): void
    (anotherArg: string): void // 重载
  }

  // 语法稍有不同，参数列表和返回类型之间的是 : 而不是 =>
  function doSomething(fn: describableFunction) {
    fn(12345)
    fn("hello")
  }
})

test(`构造签名 Construct signatures`, () => {
  /**
   * JS 函数也可以用 new 操作符调用
   * TS 会认为这是一个构造函数，产生一个新对象
   */
  interface User {
    id: number
    s: string
  }

  type someOne = {
    new(s: string): User
  }

  // TODO 不是很理解
  function fn(ctor: someOne) {
    return new ctor("hello")
  }
})

test(`泛型函数类型 Generic functions`, () => {
  function identity<T>(arg: T): T {
    return arg
  }

  function firstElement<T>(arg: T[]): T | undefined {
    if (arg.length > 0) {
      return arg[0]
    }
  }

  /**
   * 有时我们想关联 2 个值但只能操作值的一些固定字段
   * 我们可以使用 constraint 对泛型进行约束
   */
  function longest<T extends { length: number }>(
    a: T,
    b: T
  ) {
    if (a.length > b.length) {
      return a
    } else {
      return b
    }
  }

  const longerArray = longest([1, 2], [1, 2, 3])
  const longerString = longest("alice", "bob")

  // const notOK = longest(10, 100) -> Error! Numbers don't have a 'length' property

  /**
   * 声明泛型的类型参数
   */
  function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
    return arr1.concat(arr2)
  }

  // 这样没有问题
  const arr = combine([1, 2, 3], [4, 5, 6])

  // 但是这样就得手动设置 T 的泛型了！
  const arr2 = combine<string | number>([1, 2, 3], ["hello"])
})

test(`可选参数 Optional parameters`, () => {
  function f(x?: number) {
    console.log(x) // 尽管 x 被声明为 number，实际上的类型还是 number | undefined
  }

  function f1(x = 10) {
    console.log(x) // x: number 任何 undefined 参数都会被替换为 10
  }

  // 回调中的可选参数 callback
  // TODO 还有一些细节没看懂
  function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
    for (let i = 0; i < arr.length; i++) {
      callback(arr[i], i);
    }
  }

  myForEach([1, 2, 3], (a) => console.log(a));
  myForEach([1, 2, 3], (a, i) => console.log(a, i));
})

test(`函数重载 Function overloads`, () => {
  function makeDate(timestamp: number): Date
  function makeDate(m: number, d: number, y: number): Date
  function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
      return new Date(y, mOrTimestamp, d)
    } else {
      return new Date(mOrTimestamp)
    }
  }

  const d1 = makeDate(12345678)
  const d2 = makeDate(5, 5, 5)
  // 尽可能的使用联合类型代替重载
})

test(`其他需要知道的类型 Other types to know about`, () => {
  // void 表示一个函数并不会返回值，和 undefined 不一样！

  // object 是一个类型，但不是一个原始类型，不是 string, number, boolean, symbol, null, undefined

  // unknown 可以表示任何值，类似 any 但更安全，因为对 unknown 类型做任何事都是不合法的
  function f(a: any) {
    a.b() // OK
  }

  function f1(a: unknown) {
    // a.b() Error! Object is of type 'unknown'
  }

  // never 表示永远不会发生的值，比如抛出异常或者无限循环，表示一个值不会再被观察到
  function fail(msg: string): never {
    throw new Error(msg)
  }

  // Function 全局类型，总是可以被调用，且总返回 any 类型的值
  function doSomething(fn: Function) {
    fn(1, 2, 3) // 如果你准备接受一个黑盒函数，又不打算调用，() => void 会更安全一点
  }
})

test(`剩余参数 Rest parameters and arguments`, () => {
    /**
     * parameters 代表定义函数时设置的名字 -> 形参
     * arguments 代表我们传入的函数的参数 -> 实参
     */
    function multiply(n: number, ...m: number[]) {
      // m 剩余参数，必须放在所有参数的最后面，并使用 ... 语法
      // 剩余参数的类型会被隐式设置为 any[] 而不是 any
      // 如果你要设置具体的类型，必须是 Array<T> 或者 T[]
      return m.map((x) => n * x)
    }

    // 我们可以用 ... 语法数组来提供不定数量的实参
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]
    arr1.push(...arr2) // 实际传入了 3 个参数 4, 5, 6

    // 一般情况下 TS 不会假定数组是不变的
    // const args = [9, 5] 这样会报错，因为 args 可能会多一个变成 3 个值
    const args = [9, 6] as const // 这样就可以了，as const 会把数组变成不可变的
    const angle = Math.atan2(...args) // Math.atan2(y: number, x: number): number
  }
)

test(`参数解构 parameter destructuring`, () => {
  // 两种写法也是一样的 ~
  function sum({a, b, c}: { a: number, b: number, c: number }) {
    console.log(a + b + c)
  }

  type ABC = { a: number, b: number, c: number }

  function sum1({a, b, c}: ABC) {
    console.log(a + b + c)
  }
})

test(`函数的可赋值性 Assignability of functions`, () => {
  type voidFunc = () => void

  const f1: voidFunc = () => {
    return true;
  }
  /**
   * 这段代码是合法的，因为 voidFunc 的返回值是 void，所以 TS 忽略了返回值
   */

  const src = [1, 2, 3]
  const dst = [0]
  src.forEach((el) => dst.push(el))

  /**
   * 正因如此这段代码也是合法的，尽管 push 返回了一个 number
   * 而 foreach 期待一个 void 类型的函数
   * 但是 TS 忽略了这个返回值，所以仍然没有报错！
   */

  function f2(): void {
    // @ts-ignore 这是一个例外情况，当字面量定义返回一个 void 类型时就不能再发牛任何东西了！
    return true;
  }
})