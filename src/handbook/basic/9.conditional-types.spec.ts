test(`条件类型 Conditional types`, () => {
  /**
   * 很多时候需要基于输入的值决定输出的值
   */
  interface Animal {
    live(): void
  }

  interface Dog extends Animal {
    woof(): void
  }

  type E1 = Dog extends Animal ? number : string // number
  type E2 = RegExp extends Animal ? number : string // string

  /**
   * 但从这个例子可能看不出有什么用
   * 搭配泛型就很有用了
   */
  interface IdLabel {
    id: number
  }

  interface NameLabel {
    name: string
  }

  // 使用函数重载，描述了 createLabel 基于不同输入值进行不同的决策
  function createLabel(id: number): IdLabel
  function createLabel(name: string): NameLabel
  function createLabel(nameOrId: string | number): IdLabel | NameLabel {
    throw "unimplemented"
  }

  // 其实我们完全可以把逻辑写在条件类型中
  type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel

  /**
   * 效果
   */
  function createLabel1<T extends number | string>(idOrName: T): NameOrId<T> {
    throw "unimplemented"
  }

  let a = createLabel1("typescript") // NameLabel
  let b = createLabel1(2.8) // IdLabel
  let c = createLabel1(Math.random() ? "hello" : 42) // NameLabel | IdLabel
})

test(`条件类型约束 Condition type constraints`, () => {
  // type MessageOf<T> = T["message"] 会报错，因为 T 不知道有一个名为 message 的属性
  type MessageOf<T extends { message: unknown }> = T["message"]

  interface Email {
    message: string
  }

  type EmailMessageContents = MessageOf<Email> // string

  /**
   * 但是如果我们想要 MessageOf 可以传入任何类型
   * 当传入值没有 message 的时候，返回默认类型呢？
   *
   * 我们可以把约束移出来，使用一个条件类型
   */
  type MessageOf1<T> = T extends { message: unknown } ? T["message"] : never

  // 另一个例子，传入的是数组则获取数组元素的类型，否则返回传入的类型
  type Flatten<T> = T extends any[] ? T[number] : T;
})

test(`在条件类型里推断 Inferring within conditional types`, () => {
  // TODO 完全不理解！

  /**
   * 条件类型提供 infer 可以从正在比较的类型中推断类型
   * 不再借助索引访问类型，手动地获取出来
   */
  type Flatten<T> = T extends Array<infer Item> ? Item : T;

  /**
   * 我们也可以用 infer 关键字写一些有用的 类型帮助别名 (helper type alias)
   */
  type GetReturnType<T> = T extends (...args: never[]) => infer Return ? Return : never
  type Num = GetReturnType<() => number> // number
  type Str = GetReturnType<(x: string) => string> // string
  type OfficialStr = ReturnType<(x: string) => string> // string
})