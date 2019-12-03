const input = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,10,1,19,1,19,9,23,1,23,6,27,2,27,13,31,1,10,31,35,1,10,35,39,2,39,6,43,1,43,5,47,2,10,47,51,1,5,51,55,1,55,13,59,1,59,9,63,2,9,63,67,1,6,67,71,1,71,13,75,1,75,10,79,1,5,79,83,1,10,83,87,1,5,87,91,1,91,9,95,2,13,95,99,1,5,99,103,2,103,9,107,1,5,107,111,2,111,9,115,1,115,6,119,2,13,119,123,1,123,5,127,1,127,9,131,1,131,10,135,1,13,135,139,2,9,139,143,1,5,143,147,1,13,147,151,1,151,2,155,1,10,155,0,99,2,14,0,0];
const input1202 = [1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,10,1,19,1,19,9,23,1,23,6,27,2,27,13,31,1,10,31,35,1,10,35,39,2,39,6,43,1,43,5,47,2,10,47,51,1,5,51,55,1,55,13,59,1,59,9,63,2,9,63,67,1,6,67,71,1,71,13,75,1,75,10,79,1,5,79,83,1,10,83,87,1,5,87,91,1,91,9,95,2,13,95,99,1,5,99,103,2,103,9,107,1,5,107,111,2,111,9,115,1,115,6,119,2,13,119,123,1,123,5,127,1,127,9,131,1,131,10,135,1,13,135,139,2,9,139,143,1,5,143,147,1,13,147,151,1,151,2,155,1,10,155,0,99,2,14,0,0];

const OP_ADD = 1;
const OP_MULTIPLY = 2;
const OP_END = 99;

function execute(input) {

   // Create a working copy of the input
   let output = input.slice();

   // Pointer into memory
   let p = 0;

   let opcode = output[p];
   while (opcode !== OP_END) {
      let v1 = output[output[p+1]];
      let v2 = output[output[p+2]];

      if (opcode === OP_ADD) {
         output[output[p+3]] = v1 + v2;
      }
      else if (opcode === OP_MULTIPLY) {
         output[output[p+3]] = v1 * v2;
      }
      p += 4;
      opcode = output[p];
   }
   return output;
}

let result1202 = execute(input1202);
console.log("Result for Day 2, Part 1:", result1202[0]);


for (let noun = 0; noun <= 99; noun++) {
   for (let verb = 0; verb <= 99; verb++) {
      let memory = input.slice();
      memory[1] = noun;
      memory[2] = verb;
      let result = execute(memory);
      if (result[0] === 19690720) {
         console.log("Result for Day 2, Part 2:", (noun * 100) + verb);
         break;
      }
   }
}