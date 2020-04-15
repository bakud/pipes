export default class clear {

  constructor(pipes) {
    this.pipes = pipes;
  }

  main(){
    this.pipes.drawing.innerText = "";
    this.pipes.post_psh_proc();
  }

}
