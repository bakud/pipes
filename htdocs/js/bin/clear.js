export default class clear {

  constructor(pipes) {
    this.pipes = pipes;
    console.log("execute clear");
  }

  main(){
    this.pipes.drawing.innerText = "";
  }

}
