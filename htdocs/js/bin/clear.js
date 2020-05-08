export default class clear {

  constructor(pipes) {
    this.pipes = pipes;
  }

  main(args, psh){
    this.pipes.drawing.innerText = "";
    psh.exit_psh_done();
  }

}
