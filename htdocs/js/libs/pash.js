export default class pash {

  constructor(default_value, pipes) {
    this.default_value = default_value;
    this.pipes = pipes;
    console.log("start pash");
  };

  pash_proc(input_text) {
    var text = this.get_input_text(input_text);
    var cmds = this.pipe_input(text)
    for(var i in cmds) {
      if (cmds[i] !== "" && !this.is_bin(this.get_cmd(cmds[i]))) {
          console.log("hit out",cmds[i]);
          return "-pash: " + this.get_cmd(input_text) + ": command not found";
      }
      this.execute_cmd(cmds[i]);
    }


    //this.execute_cmd(input_text);
    return text;
  }

  pipe_input(text){
    return text.split("|");
  }

  get_input_text(input_text) {
    return input_text.replace(this.default_value, "");
  };

  get_cmd(cmd) {
    //var text          = this.get_input_text(input_text);
    var string_array  = cmd.split(" ");
    return string_array[0];
  };

  execute_cmd(input_text) {
    // check for could execute
    if (!this.is_bin(this.get_cmd(input_text))){
        return undefined;
    }
  };

  is_bin(cmd) {
    return undefined;
  };

}
