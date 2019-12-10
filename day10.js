let input = `.#......##.#..#.......#####...#..
...#.....##......###....#.##.....
..#...#....#....#............###.
.....#......#.##......#.#..###.#.
#.#..........##.#.#...#.##.#.#.#.
..#.##.#...#.......#..##.......##
..#....#.....#..##.#..####.#.....
#.............#..#.........#.#...
........#.##..#..#..#.#.....#.#..
.........#...#..##......###.....#
##.#.###..#..#.#.....#.........#.
.#.###.##..##......#####..#..##..
.........#.......#.#......#......
..#...#...#...#.#....###.#.......
#..#.#....#...#.......#..#.#.##..
#.....##...#.###..#..#......#..##
...........#...#......#..#....#..
#.#.#......#....#..#.....##....##
..###...#.#.##..#...#.....#...#.#
.......#..##.#..#.............##.
..###........##.#................
###.#..#...#......###.#........#.
.......#....#.#.#..#..#....#..#..
.#...#..#...#......#....#.#..#...
#.#.........#.....#....#.#.#.....
.#....#......##.##....#........#.
....#..#..#...#..##.#.#......#.#.
..###.##.#.....#....#.#......#...
#.##...#............#..#.....#..#
.#....##....##...#......#........
...#...##...#.......#....##.#....
.#....#.#...#.#...##....#..##.#.#
.#.#....##.......#.....##.##.#.##`;


let rows = input.split('\n');

function distance(p1, p2) {
   return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Determine if a point is on the same line and between two endpoints
// If distance between segments === distance from end to end, then point is betweeen the other 2
function isBetween(point, end1, end2) {
   let d1 = distance(point, end1) + distance(point, end2);
   let d2 = distance(end1, end2);

   // Account for rounding issues in javascript ... can't have exact equality with floating point
   return Math.abs(d1 - d2) < 0.000001;
}

let asteroids = [];

// find all asteroids
for (let y=0; y<rows.length; y++) {
   let cols = rows[y].split('');
   for (let x=0; x<cols.length; x++) {
      if (cols[x] !== '#') continue;
      let asteroid = { x, y, count:0 };
      asteroids.push(asteroid);
   }
}

// count number of asteroids that are visible from each asteroid
asteroids.forEach((end1) => {
   asteroids.forEach((end2) => {
      let hasBetween = false;
      if (end1 === end2) return;
      for (let i=0; i<asteroids.length; i++) {
         let between = asteroids[i];
         if (between === end1  ||  between === end2) continue;
         if (isBetween(between, end1, end2)) {
            hasBetween = true;
            break;
         }
      }
      if (!hasBetween) end1.count++;
   });
});

// Find asteroid with the most other asteroids being visible
let base = { count: 0 };
asteroids.forEach((a) => {
   if (a.count > base.count) base = a;
});

console.log("Result for Day 10, Part 1:", base.count);


// Determine angle of each asteroid from base station
// Then loop through each angle marking innermost as destroyed
let degreePoints = {};

asteroids.forEach((a) => {
   let radians = Math.atan2((base.y - a.y), (base.x - a.x));
   let degrees = radians * (180/Math.PI);
   if (degrees < 90) degrees += 360;
   if (!degreePoints[degrees]) degreePoints[degrees] = [];
   degreePoints[degrees].push({ asteroid: a, distance: distance(base, a) });
});

let allDegrees = [];
Object.keys(degreePoints).forEach((degrees) => {
   allDegrees.push(parseFloat(degrees));

   // Make sure asteroids at each angle are sorted by distance from base
   degreePoints[degrees].sort(function(a, b){return a-b});
});

// Make sure all degrees are in right sort order
allDegrees.sort(function(a, b){return a-b});

let lastDestroyed = {};
let destroyed = 0;
while (destroyed < 200) {
   for (let i=0; i<allDegrees.length  &&  destroyed < 200; i++) {
      let group = degreePoints[allDegrees[i]];
      for (let j=0; j<group.length && destroyed < 200; j++) {
         if (!group[j].destroyed) {
            group[j].destroyed = true;
            destroyed++;
//            console.log(destroyed + ':', group[j]);
            lastDestroyed = group[j];
            break;
         }
      }
   }
}

console.log("Result for Day 10, Part 2:", lastDestroyed.asteroid.x * 100 + lastDestroyed.asteroid.y);
