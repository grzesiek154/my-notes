console.log("test");

const fib = (n) => {
  if(n <= 2) return 1;
  return fib(n - 1) + fib(n-2);
}
//memoization
//js object, keys will be arg to fn, value will be the return value

const fib2 = (n, memo = {}) => {
  if(n <= 2) return 1;
  return fib(n - 1) + fib(n-2);
}
console.log(fib(6));
console.log(fib(7));
console.log(fib(8));