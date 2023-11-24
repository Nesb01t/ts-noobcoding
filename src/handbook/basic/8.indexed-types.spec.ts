test(`索引访问类型 Indexed access types`, () => {
  // 我们可以使用访问访问类型查找另一个类型上的特定属性
  type Person = { age: number, name: string, alive: boolean }
  type Age = Person['age'] // type Age = number

  // 因为索引名本身就是一个类型，所以我们可以使用联合、keyof
  type I1 = Person['age' | 'name'] // type I1 = string | number
  type I2 = Person[keyof Person] // type I2 = string | number | boolean
})

test(`实战实例`, () => {
  const APP = ['taobao', 'baidu', 'alipay']

  function getApp(app: string) {
    return APP.includes(app)
  }

  getApp('taobao') // OK

  /**
   * 如果只是约束 string 类型当然不会出错，当我们也可以用字面量联合约束一下
   *
   * 这样的话写两遍会显得冗余，我们就可以使用 typeof 实现了
   */
  const APP1 = ['taobao', 'baidu', 'alipay'] as const
  type App = typeof APP1[number]

  function getApp1(app: App) {
    return APP1.includes(app)
  }

  getApp1('taobao') // OK

  /**
   * 1. 首先使用 as const 将数组变为 readonly 的元组
   * 2. 此时 APP1 仍然是个值，我们通过 typeof 获取 APP1 的类型
   * 3. 最后通过索引访问类型，获取字符串联合类型 type of APP1[number]
   */
})