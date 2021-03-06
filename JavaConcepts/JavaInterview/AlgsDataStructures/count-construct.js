const countConstruct = (target, wordBank) => {
  if (target === '') return 1;

  let totalCount = 0;

  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const numWays = countConstruct(target.slice(word.length), wordBank);
      totalCount += numWays;
    }
  }
  return totalCount
}

const countConstruct_memo = (target, wordBank, memo={}) => {
  if (target in memo) return memo[target];
  if (target === '') return 1;

  let totalCount = 0;

  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const numWays = countConstruct(target.slice(word.length), wordBank, memo);
      totalCount += numWays;
    }
  }
  memo[target] = totalCount;
  return totalCount
}


console.log(countConstruct("purple", ["purp", "p", "ur", "le", "purpl"]));
console.log(countConstruct("abcdef", ["ab", "abc", "cd", "def", "abcd"]));
console.log(countConstruct("skateboard", ["bo", "rd", "ate", "t", "ska", "sk", "boar"]));

console.log(countConstruct_memo("purple", ["purp", "p", "ur", "le", "purpl"]));
console.log(countConstruct_memo("abcdef", ["ab", "abc", "cd", "def", "abcd"]));
console.log(countConstruct_memo("skateboard", ["bo", "rd", "ate", "t", "ska", "sk", "boar"]));