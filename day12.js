let input = `<x=4, y=12, z=13>
<x=-9, y=14, z=-3>
<x=-7, y=-1, z=2>
<x=-11, y=17, z=-1>`;


// Parse input date into some structures we can use
function numberBetween(s, f1, f2) {
   let n1 = s.indexOf(f1) + f1.length;
   let n2 = s.indexOf(f2, n1);
   return parseInt(s.substring(n1, n2));
}

let moons = [];
let rows = input.split('\n');
rows.forEach((row) => {
   let position = {
      x: numberBetween(row, '<x=', ','),
      y: numberBetween(row, ', y=', ','),
      z: numberBetween(row, ', z=', '>')
   };

   moons.push({
      position,
      velocity: { x: 0, y: 0, z: 0 },
      cyclesX: [],
      cyclesY: [],
      cyclesZ: [],
   });
});


// Get a simple string representing "state" of this dimension for easy comparison
function getState(dimension) {
   let state = "";
   moons.forEach((m) => {
      state += "p" + m.position[dimension] + "v" + m.velocity[dimension];
   });
   return state;
}

// Each dimension has its own cycle that will repeat... keep data on each
let dimensions = {
   x: { initialState: getState('x'), cycle: 0 },
   y: { initialState: getState('y'), cycle: 0 },
   z: { initialState: getState('z'), cycle: 0 }
};

let i = 0;

while (true) {

   // Look for the cycle of each state (skip first step)
   if (i > 0) {
      if (!dimensions.x.cycle  &&  getState('x') === dimensions.x.initialState) dimensions.x.cycle = i;
      if (!dimensions.y.cycle  &&  getState('y') === dimensions.y.initialState) dimensions.y.cycle = i;
      if (!dimensions.z.cycle  &&  getState('z') === dimensions.z.initialState) dimensions.z.cycle = i;
   }

   // If cycle for each dimension has been found we are done (if happened before 1000th iteration, screwed for part 1)
   if (dimensions.x.cycle  &&  dimensions.y.cycle  &&  dimensions.z.cycle) {
      break;
   }

   // Apply gravity
   moons.forEach((m1) => {
      moons.forEach((m2) => {
         if (m1 === m2) return;

         if (m1.position.x < m2.position.x) m1.velocity.x += 1;
         else if (m1.position.x > m2.position.x) m1.velocity.x -= 1;

         if (m1.position.y < m2.position.y) m1.velocity.y += 1;
         else if (m1.position.y > m2.position.y) m1.velocity.y -= 1;

         if (m1.position.z < m2.position.z) m1.velocity.z += 1;
         else if (m1.position.z > m2.position.z) m1.velocity.z -= 1;
      });
   });

   // apply velocity
   moons.forEach((m) => {
      m.position.x += m.velocity.x;
      m.position.y += m.velocity.y;
      m.position.z += m.velocity.z;
   });

   i++;

   // If this is the 1000th iteration, output part 1 result
   if (i === 1000) {
      // Calculate energy
      let sum = 0;
      moons.forEach((m) => {
         let potential = Math.abs(m.position.x) + Math.abs(m.position.y) + Math.abs(m.position.z);
         let kinetic = Math.abs(m.velocity.x) + Math.abs(m.velocity.y) + Math.abs(m.velocity.z);
         let total = potential * kinetic;
         sum += total;
      });

      console.log("Result for Day 12, Part 1:", sum);
   }
}

function gcd(a,b) {
   a = Math.abs(a);
   b = Math.abs(b);
   if (b > a) {var temp = a; a = b; b = temp;}
   while (true) {
      if (b === 0) return a;
      a %= b;
      if (a === 0) return b;
      b %= a;
   }
}

function lcm(a,b) {
   a = Math.abs(a);
   b = Math.abs(b);
   return (a*b) / gcd(a,b);
}

// Calculate lowest common multiple of the 3 cycles...
let lcm1 = lcm(dimensions.x.cycle, dimensions.y.cycle);
let lcm2 = lcm(lcm1, dimensions.z.cycle);

console.log("Result for Day 12, Part 2:", lcm2);
