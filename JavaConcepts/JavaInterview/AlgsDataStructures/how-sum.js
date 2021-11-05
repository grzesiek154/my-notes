// m = target sum
// n = numbers.length
// time = O(n^m * m)
// space = O(m)
const howSum = (targetSum, numbers) => {
  //we return empty arr insead of 0, 
  // because we need to find combination of numbers so it will be
  // an array of numbers not a singe value
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;

  for (let num of numbers) {
    const reminder = targetSum - num;
    const reminderResult = howSum(reminder, numbers);
    if (reminderResult !== null) {
      // [ ...reminderResult, num] - we are adding all elements form "reminderResult"
      // and also new val from "num"
      return [ ...reminderResult, num];
    }
  }
  return null;
}

const howSum_memo = (targetSum, numbers, memo={}) => {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;

  for (let num of numbers) {
    const reminder = targetSum - num;
    const reminderResult = howSum_memo(reminder, numbers, memo={});
    if (reminderResult !== null) {
      memo[targetSum] = [ ...reminderResult, num];
      return memo[targetSum];
    }
  }
  memo[targetSum] = null;
  return null;
}

console.log(howSum(7, [2,3]));
console.log(howSum(7, [5,3,4,7]));
console.log(howSum(8, [2,4]));
console.log(howSum(8, [2,3,5]));
console.log(howSum_memo(13, [7,14]));