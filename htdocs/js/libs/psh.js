// bin
import clear from '../bin/clear.js';
import grep from '../bin/grep.js';
import wcat from '../bin/wcat.js';

export default class pipes_shell {

  constructor(default_value) {
    console.log("start psh");
    this.output = "aa";
  };

  set_pipes_obj(obj){
    this.pipes = obj;
  }

  psh_proc(input_text) {
    var text = this.get_input_text(input_text);
    var cmds = this.pipe_input(text);
    this.pipes.std_out(input_text + "\r\n");
    for(var i in cmds) {
      if (cmds[i] !== "" && !this.is_bin(this.get_cmd(cmds[i]))) {
          this.pipes.std_out("-psh: " + this.get_cmd(cmds[i]) + ": command not found\r\n");
          this.pipes.post_psh_proc();
          return;
      } else if (cmds[i] === "") {
          this.pipes.post_psh_proc();
          return;
      }
      this.output = this.execute_cmd(cmds[i], this.output);
      if (this.output === undefined) {
          this.pipes.std_out("-psh: " + this.get_cmd(cmds[i]) + ": command not found\r\n");
          this.pipes.post_psh_proc();
          return;
      }
    }
    this.pipes.std_out(this.output);
    this.pipes.post_psh_proc();
    this.output = "";
  }

  pipe_input(text) {
    return text.split("|");
  }

  get_input_text(input_text) {
    return input_text.replace(this.pipes.default_value, "");
  };

  get_cmd(cmd) {
    //var text          = this.get_input_text(input_text);
    var string_array  = cmd.split(" ");
    for(var i in string_array){
        if(string_array[i]) { return string_array[i]}
    }
  };

  get_args(cmd) {
    var cmd_array  = cmd.split(" ");
    cmd_array.shift();
    return cmd_array;
  }

  execute_cmd(input_text, output) {
    // check for could execute
    if (!this.is_bin(this.get_cmd(input_text))){
        return undefined;
    }
    // execute
    var bin;
    var name = this.get_cmd(input_text);
    eval("bin = new " + name + "(this.pipes);");
    try {
      var res = bin.main(this.get_args(input_text), output);
      bin = null;

      return res;
    } catch (e){
      return undefined;
    }
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
