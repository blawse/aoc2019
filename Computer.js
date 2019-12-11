/**
 * Now using a class as a "Computer" so we can instantiate multiple of them to run at once and maintain individual states of each
 *
 * @param inputProgram - program to initialize this computer with
 * @param initialInputs - initial set of inputs for this computer
 * @constructor
 *
 */
function Computer(inputProgram, initialInputs) {

   const OP_ADD = 1;
   const OP_MULTIPLY = 2;
   const OP_INPUT = 3;
   const OP_OUTPUT = 4;
   const OP_JUMP_IF_TRUE = 5;
   const OP_JUMP_IF_FALSE = 6;
   const OP_LESS_THAN = 7;
   const OP_EQUALS = 8;
   const OP_RELBASE = 9;

   const OP_END = 99;

   let instructions = {};
   instructions[OP_ADD] = 'ADD';
   instructions[OP_MULTIPLY] = 'MULTIPLY';
   instructions[OP_INPUT] = 'INPUT';
   instructions[OP_OUTPUT] = 'OUTPUT';
   instructions[OP_JUMP_IF_TRUE] = 'JUMP_IF_TRUE';
   instructions[OP_JUMP_IF_FALSE] = 'JUMP_IF_FALSE';
   instructions[OP_LESS_THAN] = 'LESS_THAN';
   instructions[OP_EQUALS] = 'EQUALS';
   instructions[OP_END] = 'END';
   instructions[OP_RELBASE] = 'RELBASE';

   let inputQueue = (initialInputs || []).slice();

   let memory = inputProgram.slice();

   let p = 0;
   let _isRunning = true;
   let relbase = 0;

   function getValue(b, mode) {
      if (mode === 0) return memory[b] || 0;
      if (mode === 1) return b || 0;
      if (mode === 2) return memory[relbase + b] || 0;

      return 0;
   }

   /**
    * This function is overkill in parsing out parameters to be used later, but should allow easy debugging if needed
    */
   function processNextOpcode() {
      let opcode = memory[p] % 100;
      let instruction = instructions[opcode];

      let op = {
         instruction,
         opcode,
         p,
         relbase,
         b0: memory[p] || 0,
         b1: memory[p + 1] || 0,
         b2: memory[p + 2] || 0,
         b3: memory[p + 3] || 0,
      };

      op.mode1 = Math.floor(op.b0/100) % 10;
      op.mode2 = Math.floor(op.b0/1000) % 10;
      op.mode3 = Math.floor(op.b0/10000) % 10;

      op.m1output = (op.mode1 === 2 ? relbase + op.b1:op.b1);
      op.m2output = (op.mode2 === 2 ? relbase + op.b2:op.b2);
      op.m3output = (op.mode3 === 2 ? relbase + op.b3:op.b3);

      op.v1 = getValue(op.b1, op.mode1);
      op.v2 = getValue(op.b2, op.mode2);
      op.v3 = getValue(op.b3, op.mode3);

      return op;
   }

   function run(inputs, getFirstOutput) {

      if (inputs) inputQueue = inputQueue.concat(inputs);

      let LAST_OUTPUT = 0;

      while (true) {
         let op = processNextOpcode();

         switch(op.opcode) {
            case OP_ADD:
               memory[op.m3output] = op.v1 + op.v2;
               p += 4;
               break;

            case OP_MULTIPLY:
               memory[op.m3output] = op.v1 * op.v2;
               p += 4;
               break;

            case  OP_INPUT:
               let inValue = inputQueue.shift();
               memory[op.m1output] = inValue;
               p += 2;
               break;

            case OP_OUTPUT:
               LAST_OUTPUT = op.v1;
               p += 2;
               if (getFirstOutput) {
                  return LAST_OUTPUT;
//                  console.log("OUTPUT:", LAST_OUTPUT);
               }
               break;

            case OP_JUMP_IF_TRUE:
               if (op.v1) {
                  p = op.v2;
               } else {
                  p += 3;
               }
               break;

            case OP_JUMP_IF_FALSE:
               if (op.v1 === 0) {
                  p = op.v2;
               } else {
                  p += 3;
               }
               break;

            case OP_LESS_THAN:
               memory[op.m3output] = (op.v1 < op.v2 ? 1 : 0);
               p += 4;
               break;

            case OP_EQUALS:
               memory[op.m3output] = (op.v1 === op.v2 ? 1:0);
               p += 4;
               break;

            case OP_RELBASE:
               relbase += op.v1;
               p += 2;
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

module.exports.Computer = Computer;