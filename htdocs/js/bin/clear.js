export default class clear {

  constructor(pipes) {
    this.pipes = pipes;
  }

  main(args, psh){
    this.pipes.drawing.innerText = "";
    psh.bin_proc_done = true;
    psh.exit_psh_done();
  }

}
