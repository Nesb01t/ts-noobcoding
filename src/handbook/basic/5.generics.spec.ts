/**
 * 软件工程的一个重要部分就是 构建组件
 * 组件不仅需要定义良好、一致的 API 也需要是可复用的 resuable
 * 好的组件不仅可以兼容今天的数据类型，也可以适用未来可能出现的数据类型
 * 构建大型软件的时候会给你最大的灵活度
 *
 * 在 C# 和 Java 语言中，创建可复用组件的工具，我们就成为泛型
 */
test(`恒等函数 Identify function`, () => {
  // 返回一个任何传进内容的函数就是恒等函数
  function identify<T>(arg: T): T {
    return arg
  }

  let output = identify<string>("myString") // 显式的 -> 尖括号
  let output1 = identify("myString") // 类型推断，通常这个失效了才会去用 output
})

test(`使用泛型类型变量`, () => {
  function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length) // 数组有 length 属性
    return arg
  }

  function loggingIdentity1<T>(arg: Array<T>): Array<T> {
    console.log(arg.length) // 这种写法也是一样的！
    return arg
  }
})

test(`泛型类型 Generic types`, () => {
  function identity<T>(arg: T): T {
    return arg
  }

  let myIdentity: <Input>(arg: Input) => Input = identity // 泛型的类型参数可以用不同名字，只要数量和使用方法一样就行
  let myIdentity1: { <Input>(arg: Input): Input } = identity // 也可以用对象字面量的形式！

  /**
   * 这就引导我们写出第一个泛型接口
   *
   * GenericIdentityFn -> 一个泛型函数类型
   * identity1 -> 泛型函数
   * myIdentity2 -> 泛型函数的实现
   */
  interface GenericIdentityFn {
    <T>(arg: T): T
  }

  function identity1<T>(arg: T): T {
    return arg
  }

  let myIdentity2: GenericIdentityFn = identity1
})

test(`泛型类 Generic classes`, () => {
  // TODO 待补充
})

test(`泛型约束 Generic constraints`, () => {
  // 我们想要获取参数的 .length 属性，但不是所有类型都有 length 属性，所以我们需要约束一下
  interface Lengthwise {
    length: number
  }

  // 理解 T extends Lengthwise，这样就可以保证 T 有 length 属性了
  function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length)
    return arg
  }

  loggingIdentity({length: 10, value: 3}) // 现在我们需要传入符合约束条件的值！
  loggingIdentity([1, 2, 3]) // 数组有 length 属性，所以当然也可以！
})

test(`在泛型约束中使用类型参数`, () => {
  /**
   * 你可以声明一个类型参数，且它被另一个类型参数所约束
   * 我们希望获取一个对象给定属性名的值，我们确保我们不会获取 obj 上不存在的属性
   * 所以建立一个约束
   */
  function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]
  }

  let x = {a: 1, b: 2, c: 3, d: 4}
  getProperty(x, 'a') // OK
  // getProperty(x, 'm') Error! m 不是 x 的属性
})

test(`在泛型中使用类类型`, () => {
  function create<T>(c: { new(): T }): T {
    return new c()
  }

  // TODO 待补充
})