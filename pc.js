class StackMachine {
    constructor(memorySize, stackSize) {
      this.memory = new Uint8Array(memorySize);
      this.stack = new Uint16Array(stackSize);
      this.sp = -1;  // Stack pointer
      this.ip = 0;   // Instruction pointer
    }
  
    push(value) {
      this.stack[++this.sp] = value;
    }
  
    pop() {
      return this.stack[this.sp--];
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
        console.log("Running",instruction);
        switch (instruction) {
          case 0x01: // PUSH
            this.push(this.memory[this.ip++]);
            break;
          case 0x02: // POP
            this.pop();
            break;
          case 0xFF: // HALT
            running = false;
            break;
          default:
            console.log("Unknown instruction");
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
  }

  const assemblyCode = `
PUSH 10
PUSH 20
POP
HALT
`;

runAssemblyCode(assemblyCode);
