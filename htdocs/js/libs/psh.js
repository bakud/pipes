// bin
import clear from '../bin/clear.js';
import grep from '../bin/grep.js';
import wcat from '../bin/wcat.js';
import headline from '../bin/headline.js';

export default class pipes_shell {

  constructor(default_value) {
    console.log("start psh");
  };

  set_pipes_obj(obj){
    this.pipes = obj;
  }

  exit_return(res){
    if (this.allow_done && this.proc_done) { this.exit_psh_done(); }
    return res;
  }

  continue_return(res){
    return res;
  }

  abort_proc (){
    clearInterval(this.bin_inte);
    this.exit_all_psh_done();
    for(var i in this.cmd_log){
        this[this.cmd_log[i]] = undefined;
    }
  }

  psh_proc(input_text) {

    var psh       = this;
    psh.cmds      = this.pipe_input(this.get_input_text(input_text));
    psh.proc_done = false;
    psh.bin_inte  = undefined;
    psh.cmd_log   = [];

    this.pipes_proc(psh.cmds, psh);

    var inte = setInterval(function() {

      if ( psh.proc_done ) {
          psh.exit_psh_proc (inte);
          return;
      }

    }, 50, psh);

  }

  reload_pipes_proc (){
    var psh       = this;
    this.pipes_proc(psh.cmds, psh);
  }

  pipes_proc(cmds, psh){

    for( var i in cmds ) {

      console.log(cmds[i]);

      if ( cmds[i] !== "" && !psh.is_bin(psh.get_cmd(cmds[i])) ) {
          psh.pipes.std_out("-psh: " + psh.get_cmd(cmds[i]) + ": command not found\r\n");
          psh.pipes.post_psh_proc();
          psh.exit_all_psh_done ();
          return;
      } else if ( cmds[i] === "" ) {
          psh.pipes.post_psh_proc();
          psh.exit_all_psh_done ();
          return;
      }

      if ( parseInt(i) + 1 == cmds.length ) { psh.allow_done = true; } else { psh.allow_done = false; }

      psh.output = psh.execute_cmd(cmds[i], psh);

      if ( psh.output === undefined ) {
          psh.pipes.std_out("-psh: " + psh.get_cmd(cmds[i]) + ": command not found\r\n");
          psh.pipes.post_psh_proc();
          psh.exit_all_psh_done ();
          return;
      }

    }

  }

  exit_psh_done(){
      this.proc_done = true;
  }

  exit_all_psh_done(){
      this.allow_done = true;
      this.proc_done = true;
  }

  exit_inte(inte){
    clearInterval(inte);
  }

  exit_psh_proc(inte){

      this.output = this.output === undefined ? "" : this.output;

      if(this.output_type === "html"){
        this.pipes.html_out(this.output);
      } else {
        this.pipes.std_out(this.output);
      }

      this.pipes.post_psh_proc();
      this.output = "";

      clearInterval(inte);

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
    if (cmd_array[0] === "") { cmd_array.shift(); }
    cmd_array.shift();
    return cmd_array;
  }

  execute_cmd(input_text, output, psh) {
    // check for could execute
    if (!this.is_bin(this.get_cmd(input_text))){
        return undefined;
    }
    // execute
    var bin;
    var name = this.get_cmd(input_text);
    if (!this.cmd_log.some(value => value === name)) {
      this[name] = {};
      this.cmd_log.push(name);
    }
    eval("bin = new " + name + "(this.pipes);");
    try {
      this.output_type = bin.output_type !== undefined ? bin.output_type : "";
      var res = bin.main(this.get_args(input_text), output, psh);
      bin = null;
      return res;
    } catch (e){
      console.log(e);
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
