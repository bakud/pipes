// bin
import clear from '../bin/clear.js';
import grep from '../bin/grep.js';
import cat from '../bin/cat.js';

export default class pipes_shell {

  constructor(default_value) {
    console.log("start psh");
  };

  set_pipes_obj(obj){
    this.pipes = obj;
  }

  psh_proc(input_text) {
    var text = this.get_input_text(input_text);
    var cmds = this.pipe_input(text)
    for(var i in cmds) {
      if (cmds[i] !== "" && !this.is_bin(this.get_cmd(cmds[i]))) {
          return this.pipes.std_out("-psh: " + this.get_cmd(cmds[i]) + ": command not found\r\n");
      } else if (cmds[i] === ""){
          return this.pipes.std_out("\r\n");
      }
      text = this.execute_cmd(cmds[i]);
    }

    return text;
  }

  pipe_input(text){
    return text.split("|");
  }

  get_input_text(input_text) {
    return input_text.replace(this.pipes.default_value, "");
  };

  get_cmd(cmd) {
    //var text          = this.get_input_text(input_text);
    var string_array  = cmd.split(" ");
    return string_array[0];
  };

  get_args(cmd){
    var cmd_array  = cmd.split(" ");
    cmd_array.shift();
    return cmd_array;
  }

  execute_cmd(input_text) {
    // check for could execute
    if (!this.is_bin(this.get_cmd(input_text))){
        return undefined;
    }
    // execute
    var bin;
    var name = this.get_cmd(input_text);
    eval("bin = new " + name + "(this.pipes);");
    console.log(this.get_args(input_text));
    bin.main();
    bin = null;

  };

  is_bin(cmd) {
    var res;
    try {
      eval("res = (typeof " + cmd + ")");
      if (res === "undefined") { return false };
      return true;
    } catch(e){
      return false;
    }
  };

}
