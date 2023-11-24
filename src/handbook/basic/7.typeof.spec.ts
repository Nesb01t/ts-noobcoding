test(`typeof 类型操作符`, () => {
  console.log(typeof "hello world") // log -> string

  let s = 'hello'
  let n: typeof s // n: string

  /**
   * 如果仅仅用来判断基本类型，没有太大作用，需要和其他的类型操作符搭配使用
   *
   * Return<T> 你传入一个函数类型，ReturnType<T> 会返回该函数的返回值的类型
   */
  type Predicate = (x: unknown) => boolean;
  type K = ReturnType<Predicate> // K: boolean

  // 如果我们直接对函数名使用 ReturnType 会报错
  function f() {
    return {x: 10, y: 3}
  }

  // type P = ReturnType<f> 这是因为 values 和 types 不是一个东西
  type P = ReturnType<typeof f> // P: {x: number, y: number}
})

test(`限制 Limitation`, () => {
  /**
   * TS 有意限制了可以使用 typeof 的表达式的种类
   * 只有对标识符或者属性使用 typeof 才是合法的
   */
  type msgbox = () => string

  // let shoudContinue: typeof msgbox('Are you sure you want to continue?')
  let shoudContinue: ReturnType<msgbox>
})

test(`对一个函数使用 typeof`, () => {
  function identity<T>(arg: T): T {
    return arg
  }

  type result = typeof identity // result: <T>(arg: T) => T
})