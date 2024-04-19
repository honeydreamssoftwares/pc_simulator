class StackMachine {
    constructor(memorySize, stackSize) {
      this.memory = new Uint8Array(memorySize);
      this.stack = new Uint16Array(stackSize);
      this.sp = -1;  // Stack pointer
      this.ip = 0;   // Instruction pointer
    }

    dumpStack() {
        console.log("Stack Dump:", this.stack.slice(0, this.sp + 1));
    }

    dumpMemory() {
        console.log("Memory Dump:", this.memory);
    }

    nop() {
        this.ip++;
    }

    push(value) {
      this.stack[++this.sp] = value;
    }

    pop() {
      if (this.sp >= 0) {
          return this.stack[this.sp--];
      } else {
          console.error("Stack Underflow!");
          return undefined;
      }
    }

    readMemory(address) {
        if (address >= 0 && address < this.memory.length) {
            return this.memory[address];
        } else {
            console.error("Memory Access Error: Address out of bounds");
            return undefined;
        }
    }

    writeMemory(address, value) {
        if (address >= 0 && address < this.memory.length) {
            this.memory[address] = value;
        } else {
            console.error("Memory Write Error: Address out of bounds");
        }
    }

    fetch() {
      return this.memory[this.ip++];
    }

    loadProgram(program) {
        this.memory.set(program);
        this.ip = 0; // Reset instruction pointer to start of the program
    }

    run() {
      let running = true;
      while (running) {
        const instruction = this.fetch();
        console.log("Running instruction", instruction);
        switch (instruction) {
          case 0x00:
            console.log("NOP");
            this.nop();
            break;
          case 0x01: // PUSH
            this.push(this.memory[this.ip++]);
            break;
          case 0x02: // POP
            this.pop();
            break;
          case 0xFF: // HALT
            console.log("HALT");
            running = false;
            break;
          default:
            console.error("Unknown instruction:", instruction);
            running = false;
        }
      }
    }
}

function assemble(code) {
    const instructions = {
      "PUSH": 0x01,
      "POP": 0x02,
      "HALT": 0xFF
    };
    const output = [];
    code.split("\n").forEach(line => {
      const parts = line.trim().split(" ");
      output.push(instructions[parts[0]]);
      if (parts.length > 1) {
        output.push(parseInt(parts[1]));
      }
    });
    return new Uint8Array(output);
}

function runAssemblyCode(assemblyCode) {
    const program = assemble(assemblyCode);
    const machine = new StackMachine(256, 128);
    machine.loadProgram(program);
    machine.run();
    machine.dumpStack();
    machine.dumpMemory();
}

const assemblyCode = `
PUSH 10
PUSH 20
PUSH 50
PUSH 4
PUSH 9
PUSH 0
PUSH 78
POP
POP
POP
POP
PUSH 4
HALT
`;

runAssemblyCode(assemblyCode);
