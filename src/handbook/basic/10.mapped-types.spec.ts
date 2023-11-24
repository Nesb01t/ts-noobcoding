test(`映射类型 Mapped types`, () => {
  /**
   * 有时一个类型要基于另一个类型
   * 但又不想拷贝一份，就可以使用 mapped types
   *
   * mapped types 建立在 索引签名 的语法上，我们回顾一下索引签名
   */
  type OnlyBoolsAndNums = {
    [key: string]: boolean | number
  }

  const conforms: OnlyBoolsAndNums = {
    del: true,
    mike: 23
  }

  // 映射类型就是使用了 PropertyKeys 联合类型的泛型
  // 其中 PropertyKeys 多是通过 keyof 创建
  // 再循环遍历键名创建一个类型
  type OptionsFlags<T> = {
    [K in keyof T]: boolean
  }

  type FeatureFlags = {
    darkMode: () => void
    newUserProfile: () => void
  }
  type FeatureOptions = OptionsFlags<FeatureFlags>

  // 在这个例子中，OptionsFlags 会遍历 Type 所有属性，并将其设置为 boolean 类型
})

test(`映射修饰符 Mapping modifiers`, () => {
  /**
   * 在使用 mapped types 时，有 2 个额外的修饰符可能会用到
   * 一个是 readonly 一个是 ?
   * 你可以使用前缀 - 和 + 来删除或添加这些修饰符
   */
  type CreateMutable<T> = {
    - readonly [P in keyof T]: T[P] // 删除属性中的只读属性
  }

  type LockedAccount = {
    readonly id: string
    readonly name: string
  }

  type UnlockedAccount = CreateMutable<LockedAccount>
  const account: UnlockedAccount = {
    id: "123",
    name: "mike"
  }
  account.id = '666'

  const account2: LockedAccount = account
  // account2.id = "456" 不能分配到 "id" ，因为它是只读属性
})

test(`通过 as 实现键名重映射 Key remapping via as`, () => {
  type MappedTypeWithNewProperties<T> = {
    [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P]
  }

  interface Person {
    name: string
    age: number
  }

  type LazyPerson = MappedTypeWithNewProperties<Person>
  const per: LazyPerson = {
    getName: () => "mike",
    getAge: () => 23
  }

  /**
   * 你还可以遍历任何联合类型
   */
  type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
  }

  type SquareEvent = {
    kind: "square"
    size: number
  }

  type CircleEvent = {
    kind: "circle"
    radius: number
  }

  type Config = EventConfig<SquareEvent | CircleEvent>

  const config: Config = {
    square: (e) => console.log(e.size),
    circle: (e) => console.log(e.radius)
  }
})

test(`深入探索 Further exploration`, () => {
  /**
   * 映射类型也可以跟其他功能搭配使用
   * 比如这是一个使用条件类型的映射类型
   */
  type ExtractPII<T> = {
    [P in keyof T]: T[P] extends { pii: true } ? true : false
  }

  type DBFields = {
    id: { format: "incrementing" }
    name: { type: string; pii: true }
  }

  type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>
  // type ObjectsNeedingGDPRDeletion = {
  //    id: false;
  //    name: true;
  // }
})