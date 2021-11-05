const gridTraverse = (m,n) => {
  // we want max intex to in the array
  const table = Array(m+1)
    .fill()
    // for each element(array)
    // add anoter array
    .map(() => Array(n+1).fill(0));

 table[1][1] = 1;
 for (let i = 0; i <= m; i++) {
  for (let j = 0; j <= m; j++) {
      const current = table[i][j];
      if (j + 1 <= n) table[i][j + 1] += current;
      if (i + 1 <= m) table[i + 1][j] += current;
  }
 }
 return table[m][n];
}

console.log(gridTraverse(3,2));