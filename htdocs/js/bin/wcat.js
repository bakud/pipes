export default class wcat {

  constructor(pipes) {
    this.pipes        = pipes;
    this.proxy_host   = "http://pipes.ooo:4000?u=";
  }

  send_xhr (url, psh){
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', this.proxy_host + url, true );
    xhr.onreadystatechange = function () {
  		if (xhr.readyState == 4 && ( xhr.status == 200 || this.xhr.status == 304) ) {
        var wait_time = Math.floor( Math.random() * 1000 ) + 100;
        var inte = setInterval(function() {
          if ( !psh.wcat.writing_output ) {
              psh.wcat.writing_output = true;
              psh.output += xhr.responseText + "\r\n";
              //if (psh.wcat.load_count === psh.wcat.loaded_count + 1){ psh.output += "\r\n"; }
              psh.wcat.loaded_count++;
              psh.wcat.writing_output = false;
              clearInterval(inte);
              return;
          }
        }, wait_time, psh);
  		}
    }
    xhr.send();
	}

  main(args, psh){

    if (args && args.length > 0){

      psh.wcat.load_count     = args.length;
      psh.wcat.loaded_count   = 0;
      psh.wcat.writing_output = false;

      for( var i in args ) {
          if (args[i] === ""){
            psh.wcat.load_count--;
            continue;
          }
          this.send_xhr(args[i], psh);
      }

      var inte = setInterval(function() {
        if ( psh.wcat.load_count === psh.wcat.loaded_count ) {
            psh.bin_proc_done = true;
            if ( psh.allow_done ) { psh.proc_done = true; }
            clearInterval(inte);
            return;
        }
      }, 50, psh);
      return "";

    } else {
      psh.bin_proc_done = true;
      psh.proc_done = true;
      return psh.exit_return("wcat needs atleast one argument.");
    }
  }

}
