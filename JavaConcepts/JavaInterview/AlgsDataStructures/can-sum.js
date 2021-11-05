// m = target sum
// n = array length
// O(n to m expotential) time
// O(m) space

const canSum = (targetSum, numbers) => {
 // in order our solution to work
 // substracting need leed to at 
 // the end of tree to 0
  if (targetSum === 0) return true;
  if (targetSum < 0) return false;

  for(let num of numbers) {
    const reminder = targetSum - num;
    // we are invoking casSum with reminder
    // to check if we can reach base case 
    // after substracting each array value
    if (canSum(reminder, numbers) === true) {
      return true;
    }
  }
  return false;
};

const canSum_memo = (targetSum, numbers, memo={}) => {
   if (targetSum in memo) return memo[targetSum];
   if (targetSum === 0) return true;
   if (targetSum < 0) return false;
 
   for(let num of numbers) {
     const reminder = targetSum - num;

     if (canSum_memo(reminder, numbers, memo) === true) {
       memo[targetSum] = true;
       return true;
     }
   }
   memo[targetSum] = false;
   return false;
 };

console.log(canSum(7,[2,3]));//true?
console.log(canSum(7,[5,3,4,7]));//true
console.log(canSum(7,[2,4]));//false
console.log(canSum(8,[2,3,5]));//true
console.log(canSum_memo(300,[7,14]));