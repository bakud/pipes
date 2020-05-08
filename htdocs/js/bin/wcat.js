export default class wcat {

  constructor(pipes) {
    this.pipes      = pipes;
    this.proxy_host = "http://pipes.ooo:4000?u=";
    this.xhr        = new XMLHttpRequest();
    this.xhr.pipes  = pipes;
  }

  send_xhr (url){
    this.xhr.open( 'GET', this.proxy_host + url, false );
    var res = this.xhr.send();
    if ( this.xhr.status == 200 || this.xhr.status == 304 ){
      return this.xhr.responseText;
    } else {
      return "";
    }
  }

  main(args, psh){
    psh.proc_done = true;
    if (args && args.length > 0){
      var res = "";
      for( var i in args ) {
          if (args[i] === "") continue;
          res += this.send_xhr(args[i]);
          if (i !== args.length) { res += "\r\n"; }
      }
      return psh.exit_return(res);
    } else {
      return psh.exit_return("wcat needs atleast one argument.");
    }
  }

}
