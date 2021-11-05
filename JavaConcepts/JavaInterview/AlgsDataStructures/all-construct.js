const allConstruct = (target, wordBank) => {
  if (target === '') return [[]]

  const result = [];

  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const suffix = target.slice(word.length);
      // the ways how to make a suffix
      // how can i get all the ways to make the original target like
      // return 2D Array
      const suffixWays = allConstruct(suffix, wordBank);
      // we are adding "word" (prefix) to the begining of each array
      const targetWays = suffixWays.map(way => [word, ...way]);
      // with usage of "..." we add all particular elements of "targetWays" means singel array
      // instead of adding 2D array with "result.push(targetWays)""
      result.push(...targetWays)
    }
  }
  return result;
}

const allConstruct_memo = (target, wordBank, memo={}) => {
  if (target in memo) return memo[target];
  if (target === '') return [[]]

  const result = [];

  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const suffix = target.slice(word.length);
      // the ways how to make a suffix
      // how can i get all the ways to make the original target like
      // return 2D Array
      const suffixWays = allConstruct(suffix, wordBank, memo);
      // we are adding "word" (prefix) to the begining of each array
      const targetWays = suffixWays.map(way => [word, ...way]);
      // with usage of "..." we add all particular elements of "targetWays" means singel array
      // instead of adding 2D array with "result.push(targetWays)""
      result.push(...targetWays)
    }
  }
  memo[target] = result;
  return result;
}




console.log(allConstruct("purple", ["purp", "p", "ur", "le", "purpl"]));
console.log(allConstruct("abcdef", ["ab", "abc", "cd", "def", "abcd"]));
console.log(allConstruct("skateboard", ["bo", "rd", "ate", "t", "ska", "sk", "boar"]));