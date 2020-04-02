export default class clear {

  constructor(pipes) {
    this.pipes = pipes;
  }

  main(){
    this.pipes.drawing.innerText = "";
  }

}
