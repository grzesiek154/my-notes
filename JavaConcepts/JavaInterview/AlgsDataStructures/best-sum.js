// m = target sum
// n = numbers.length
// time = O(n^m * m)
// space = O(m^2)
 
 const bestSum = (targetSum, numbers) => {
   if (targetSum === 0) return [];
   if (targetSum < 0) return null;

   let shortestCobination = null;

   // of - meams particular element
   // in - index of array 
  for (let num of numbers) {
    const reminder = targetSum - num;
    // we are checking recuresevly bestSum how we can
    // combine from the number value from reminder
    const reminderCombination = bestSum(reminder, numbers);
    if (reminderCombination !== null) {
      //we are assining array with combination of number which after
      // summing give the result equals to reminder
      const combination = [...reminderCombination, num];
      // if the combination is shorter than current "shortes", updated it
      if (shortestCobination === null || combination.length < shortestCobination.length) {
        shortestCobination = combination;
      }
    }
  }
  return shortestCobination;
 }

 // m = target sum
// n = numbers.length
// time = O(m^2 * n)
// space = O(m^2)
 const bestSum_memo = (targetSum, numbers, memo={}) => {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;

  let shortestCobination = null;

  // of - meams particular element
  // in - index of array 
 for (let num of numbers) {
   const reminder = targetSum - num;
   // we are checking recuresevly bestSum how we can
   // combine from the number value from reminder
   const reminderCombination = bestSum_memo(reminder, numbers, memo);
   if (reminderCombination !== null) {
     //we are assining array with combination of number which after
     // summing give the result equals to reminder
     const combination = [...reminderCombination, num];
     // if the combination is shorter than current "shortes", updated it
     if (shortestCobination === null || combination.length < shortestCobination.length) {
       shortestCobination = combination;
     }
   }
 }
 memo[targetSum] = shortestCobination;
 return shortestCobination;
}

 console.log(bestSum(7, [5,3,4,7]));
 console.log(bestSum(8, [2,3,5]));
 console.log(bestSum(8, [1,4,5]));
 console.log(bestSum_memo(100, [1,2,5,25]));