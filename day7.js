let program = [3,8,1001,8,10,8,105,1,0,0,21,30,47,64,81,98,179,260,341,422,99999,3,9,1001,9,5,9,4,9,99,3,9,1002,9,5,9,101,4,9,9,102,2,9,9,4,9,99,3,9,102,3,9,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,1001,9,5,9,1002,9,3,9,1001,9,3,9,4,9,99,3,9,1002,9,3,9,101,2,9,9,102,5,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99];

const OP_ADD = 1;
const OP_MULTIPLY = 2;
const OP_INPUT = 3;
const OP_OUTPUT = 4;
const OP_JUMP_IF_TRUE = 5;
const OP_JUMP_IF_FALSE = 6;
const OP_LESS_THAN = 7;
const OP_EQUALS = 8;

const OP_END = 99;

/**
 * Now using a class as a "Computer" so we can instantiate multiple of them to run at once and maintain individual states of each
 *
 * @param inputProgram - program to initialize this computer with
 * @param initialInputs - initial set of inputs for this computer
 * @constructor
 *
 */
function Computer(inputProgram, initialInputs) {

   let inputQueue = (initialInputs || []).slice();

   let memory = inputProgram.slice();
   let p = 0;
   let _isRunning = true;

   function run(INPUTS, getFirstOutput) {

      inputQueue = inputQueue.concat(INPUTS);

      let LAST_OUTPUT = 0;

      while (true) {
         let opcode = memory[p] % 100;
         let mode1 = Math.floor(memory[p]/100) % 10;
         let mode2 = Math.floor(memory[p]/1000) % 10;

         let v1 = (mode1 ? memory[p+1]:memory[memory[p+1]]);
         let v2 = (mode2 ? memory[p+2]:memory[memory[p+2]]);

         switch(opcode) {
            case OP_ADD:
               memory[memory[p + 3]] = v1 + v2;
               p += 4;
               break;

            case OP_MULTIPLY:
               memory[memory[p + 3]] = v1 * v2;
               p += 4;
               break;

            case  OP_INPUT:
               v1 = memory[p + 1];
               memory[v1] = inputQueue.shift();
               p += 2;
               break;

            case OP_OUTPUT:
               LAST_OUTPUT = v1;
               p += 2;
               if (getFirstOutput) {
                  return v1;
               }
               break;

            case OP_JUMP_IF_TRUE:
               if (v1) {
                  p = v2;
               } else {
                  p += 3;
               }
               break;

            case OP_JUMP_IF_FALSE:
               if (v1 === 0) {
                  p = v2;
               } else {
                  p += 3;
               }
               break;

            case OP_LESS_THAN:
               memory[memory[p + 3]] = (v1 < v2 ? 1 : 0);
               p += 4;
               break;

            case OP_EQUALS:
               memory[memory[p + 3]] = (v1 === v2 ? 1 : 0);
               p += 4;
               break;

            case OP_END:
               _isRunning = false;
               if (getFirstOutput) {
                  return 0;
               } else {
                  return LAST_OUTPUT;
               }
         }
      }
   }

   function isRunning() {
      return _isRunning;
   }

   //
   //  Publicly accessible functions...
   //
   this.run = run;
   this.isRunning = isRunning;
}

// Takes an array as input, and returns an array of arrays where each array is a unique permutation of the input array
function getPermutations(inputArr) {
   let result = [];

   function permute(arr, m = []) {
      if (arr.length === 0) {
         result.push(m)
      } else {
         for (let i = 0; i < arr.length; i++) {
            let curr = arr.slice();
            let next = curr.splice(i, 1);
            permute(curr.slice(), m.concat(next))
         }
      }
   }

   permute(inputArr);

   return result;
}


let highest = 0;

let sequences = getPermutations([0,1,2,3,4]);
sequences.forEach((sequence) => {
   let output = 0;
   for (let i=0; i<5; i++) {
      let phase = sequence[i];
      let computer = new Computer(program);
      let inputs = [phase, output];
      output = computer.run(inputs);
   }
   if (output > highest) highest = output;
});

console.log("Result for Day 7, Part 1:", highest);



highest = 0;

sequences = getPermutations([5,6,7,8,9]);
sequences.forEach((sequence) => {
   let computers = [
      new Computer(program, [sequence[0]]),
      new Computer(program, [sequence[1]]),
      new Computer(program, [sequence[2]]),
      new Computer(program, [sequence[3]]),
      new Computer(program, [sequence[4]])
   ];

   let output = 0;

   //
   // Keep rotating through all the computers passing output of previous to input of the next
   // until one of the computers is no longer running
   //
   for (let n = 0; ; n++) {
      let computer = computers[n % computers.length];
      output = computer.run([output], true);
      if (output > highest) highest = output;
      if (!computer.isRunning()) break;
   }
});

console.log("Result for Day 7, Part 2:", highest);


