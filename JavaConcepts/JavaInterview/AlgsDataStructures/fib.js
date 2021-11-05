console.log("test");

const fib = (n) => {
  if(n <= 2) return 1;
  return fib(n - 1) + fib(n-2);
}
//memoization
//js object, keys will be arg to fn, value will be the return value

const fib_memo = (n, memo = {}) => {
  if(n in memo) return memo[n];
  if(n <= 2) return 1;
  // store the result in memo object
  // inside memo[n] we store the curent val for fib(n)
  // eg: memo{
  //   3:2,
  //   4:3,
  //   5:5
  // }
  memo[n] = fib_memo(n - 1, memo) + fib_memo(n-2, memo);
  return memo[n];
}
console.log(fib(6));
console.log(fib(7));
console.log(fib(8));

console.log("with memo: " + fib_memo(6));
console.log("with memo: " + fib_memo(7));
console.log("with memo: " + fib_memo(8));