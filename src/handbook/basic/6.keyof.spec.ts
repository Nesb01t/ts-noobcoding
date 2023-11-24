test(`keyof 类型操作符`, () => {
  type Point = { x: number, y: number }
  type P = keyof Point // 这里的类型 P 就等同于 => "x" | "y"

  type Arrayish = { [n: number]: unknown }
  type A = keyof Arrayish // 如果这个类型有一个 number & string 类型的索引签名，那么 A 就等同于 => number & string
})

/**
 * 冴羽大佬注：原文到这里就结束了
 */

test(`数字字面量联合类型`, () => {
  const NumericObj = {
    [1]: 'a',
    [2]: 'b',
    [3]: 'c'
  }

  type Result = keyof typeof NumericObj
  /**
   * type of NumericObj 是 {1: string, 2: string, 3: string}
   * 所以 keyof typeof NumericObj 就是 1 | 2 | 3
   */
})

test(`Symbol`, () => {
  // TODO 待补充
})

test(`对类使用 typeof`, () => {
  // TODO 待补充
})

test(`实战`, () => {
  function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]
  }

  let x = {a: 1, b: 2, c: 3, d: 4}
  getProperty(x, 'a') // OK
  // getProperty(x, 'm') 会产生报错:
  // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
})