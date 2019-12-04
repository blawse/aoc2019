/**
 * Went extremely brute force on this one... maximum number of values is < 900,000 so iterating across all of them
 * and checking each does not take long...
 */

function isValid(digits) {
   let dup = false;
   for (let i=0; i<digits.length - 1; i++) {
      if (digits[i] > digits[i+1]) return false;
      if (digits[i] === digits[i+1]) dup = true;
   }
   return dup;
}

function hasExactly2(digits) {
   let count = 1;
   for (let i=1; i<digits.length; i++) {
      if (digits[i] === digits[i-1]) {
         count++;
      }
      else {
         if (count === 2) return true;
         count = 1;
      }
   }
   return (count === 2);
}

let min = 165432;
let max = 707912;

let count = 0;
let count2 = 0;
for (let n=min; n<=max; n++) {
   let digits = n.toString().split('').map(Number);

   if (isValid(digits)) {
      count++;

      if (hasExactly2(digits)) count2++;
   }
}

console.log("Result for Day 4, Part 1:", count);
console.log("Result for Day 4, Part 2:", count2);
