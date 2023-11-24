test(`readonly`, () => {
  interface User {
    readonly id: number
    name: string
  }

  function logUser(user: User) {
    console.log(user.id)
    user.name = user.id.toString()
  }
})

test(`索引签名 index signature`, () => {
  /**
   * 有时你不能提前知道类型里面所有属性的名字
   * 你可以通过 索引签名 来描述可能的值的类型
   */
  interface StrArray {
    [index: number]: string // 索引签名的类型一定是 string or number
  }

  const myArray: StrArray = {[12]: "hello", [15]: "world"}
  const secondItem = myArray[12]

  interface NumberDictionary {
    length: number;
    // @ts-ignore 试着理解为什么 name: string 会报错！
    name: string; // Property 'name' of type 'string' is not assignable to 'string' index type 'number'.

    [index: string]: number;
  }
})

test(`属性继承 Extending types`, () => {
  interface Animal {
    name: string,
  }

  /**
   * interface 也可以 extends 多个类型！
   */
  interface Bear extends Animal {
    honey: boolean
  }
})

test(`交叉类型 Intersection types`, () => {
  interface Colorful {
    color: string
  }

  interface Circle {
    radius: number
  }

  type ColorfulCircle = Colorful & Circle
})

test(`接口继承与交叉类型 Interfaces vs intersections`, () => {
  interface Colorful {
    color: string;
  }

  // 这样是会报错的，因为 重写 & extends 产生了冲突，会导致编译错误
  // interface ColorfulSub extends Colorful {
  //   color: number
  // }

  type ColorfulSub = Colorful & {
    color: number
  }
  /**
   * 这样虽然不会报错，但 color 的类型是 never！取的是 string 和 number 的交集
   */
})

test(`泛型对象类型 Generic object types`, () => {
  interface Box {
    contents: unknown // 我们可以用 any，但容易翻车，所以用 unknown
  }

  let x: Box = {
    contents: "hello"
  }
  /**
   * 办法 1 - 类型收窄 & 断言
   * 这样显然有的时候会有麻烦
   */
  if (typeof x.contents === 'string') {
    console.log(x.contents.toUpperCase())
  } else {
    console.log((x.contents as string).toUpperCase())
  }

  /**
   * 办法 2 - 根据 contents 类型拆分 Box，使之更具体
   * 缺点更明显，硬编码不说，还会创建出一堆函数重载 & 声明
   */
  interface StringBox {
    contents: string
  }

  interface NumberBox {
    contents: number
  }

  /**
   * 泛型写法
   */
  interface TypedBox<T> {
    contents: T
  }

  // 把 TypedBox 想象成一个实际类型的模板
  let box: TypedBox<string> = {contents: "hello"}

  function setContents<T>(box: TypedBox<T>, newContents: T) {
    box.contents = newContents
  }

  /**
   * 类型也可以写成泛型，而且可以描述一些其他种类的泛型帮助类型
   */
  type OrNull<T> = T | null
  type OneOrMany<T> = T | T[]
  type OneOrManyOrNull<T> = OrNull<OneOrMany<T>>
  type OneOrManyOrNullStrings = OneOrManyOrNull<string>
})

test(`Array 类型`, () => {
  /**
   * 前面讲过 Array<number> 和 number[] 是一样的
   * 实际上 number[] 只是 Array<number> 的简写形式 ~
   *
   * 类似的还有 Map<K, V> Set<T> Promise<T>
   */
  function doStuff(values: ReadonlyArray<string>) {
    // 这是一个特殊类型，描述数组不能被改变，我们可以把一个常规数组赋值给 readonly array
    // 或者使用更简短的写法 values: readonly string[]

    // values.push("hello") Error!
    console.log(values)
  }
})

test(`元组类型 Tuple types`, () => {
  // 元组是另一种 Array 当你明确知道数组有多少元素就可以使用 元组类型
  type StringNumPair = [string, number]

  function doSth(pair: [string, number]) {
    const a = pair[0]
    const b = pair[1]

    const [x, y] = pair // 我们也可以用 JS 的数组结构语法 -> 解构赋值
  }

  type Either2dOr3d = [number, number, number?] // 可选属性也是可以写在这里的
  type StringNumberBooleans = [string, number, boolean?] // 元组也可以使用剩余元素语法，但必须是 array / tuple 类型

  // 可选元素和剩余元素，使得 TS 可以在参数列表使用元组
  function readButtonInput(...args: [string, number?, ...boolean[]]) {
    const [name, version, ...input] = args
  }

  function readButtonInputEqually(name: string, version?: number, ...input: boolean[]) {
    // ... 这两个函数是基本等同的！
  }
})