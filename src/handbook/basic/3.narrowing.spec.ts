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