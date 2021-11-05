const gridTraveler = (m,n) => {
  // m - row
  // n - column
  if (m === 1 && n === 1) return 1;
  if (m === 0 || n === 0) return 0;
  return gridTraveler(m - 1, n) + gridTraveler(m, n -1);

}

const gridTraveler_memo = (m,n, memo={}) => {
  // m - row
  // n - column
  const key = m + ' , ' + n;
  if (key in memo) return memo[key];
  if (m === 1 && n === 1) return 1;
  if (m === 0 || n === 0) return 0;
  memo[key] = gridTraveler_memo(m - 1, n, memo) + gridTraveler_memo(m, n -1, memo);

  return memo[key];
}

console.log(gridTraveler(1,1));
console.log(gridTraveler(3,3));
//console.log(gridTraveler(18,18));

console.log(gridTraveler_memo(1,1));
console.log(gridTraveler_memo(3,3));
console.log(gridTraveler_memo(18,18));