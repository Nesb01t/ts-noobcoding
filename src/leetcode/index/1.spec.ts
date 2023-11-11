function twoSumForce(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
  return [0, 0]
};

function twoSum(nums: number[], target: number): number[] {
  let map: Map<number, number> = new Map;
  let repeat: number[] = []
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == target - nums[i] && map.has(nums[i]) && repeat.length == 0) {
      // @ts-ignore
      repeat = [map.get(nums[i]), i];
    }
    map.set(nums[i], i);
  }
  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i]) && nums[i] != target - nums[i]) {
      // @ts-ignore
      return [i, map.get(target - nums[i])]
    }
  }
  return repeat
};

test("1", () => {
  expect(twoSum([2, 7, 11, 15], 9)).toStrictEqual([0, 1])
  expect(twoSum([3, 2, 4], 6)).toStrictEqual([1, 2])
  expect(twoSum([3, 3], 6)).toStrictEqual([0, 1])
})