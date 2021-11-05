const canConstruct = (target, wordBank) => {
  if (target === '') return true;

  for (let word of wordBank) {
    // check it there is a prefix
    if (target.indexOf(word) === 0) {
        // creae a suffix starting from next element after prefix
        const suffix = target.slice(word.length);
        if (canConstruct(suffix, wordBank) === true) {
          return true;
        }
    }
  }
  return false;
}

const canConstruct_memo = (target, wordBank, memo={}) => {
  if (target in memo) return memo[target];
  if (target === '') return true;

  for (let word of wordBank) {
    // check it there is a prefix
    if (target.indexOf(word) === 0) {
        // creae a suffix starting from next element after prefix
        const suffix = target.slice(word.length);
        if (canConstruct(suffix, wordBank, memo) === true) {
          memo[target] = true;
          return true;
        }
    }
  }
  memo[target] = false;
  return false;
}

console.log(canConstruct("abcdef", ["ab", "abc", "cd", "def", "abcd"]));
console.log(canConstruct("skateboard", ["bo", "rd", "ate", "t", "ska", "sk", "boar"]));