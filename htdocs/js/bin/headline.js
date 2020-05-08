export default class headline {

  constructor(pipes) {
    this.pipes       = pipes;
    this.output_type = "html"
    this.wait_time   = 60000;
    this.prefix_output = '<div style="font-weight: bold;">';
    this.suffix_output = '</div>';
  }

  main(args, psh) {

      if ( psh.output === undefined ) { return ""; }

      if ( args[0] === '-t' ) {
        psh.proc_done = false;
        var output = this.parse_output(psh);
        if (output !== this.prefix_output + this.suffix_output){
            psh.pipes.html_out(output);
            psh.pipes.focus_to_bottom();
        }
        psh.bin_inte = setTimeout(function() {
            psh.reload_pipes_proc();
        }, this.wait_time, psh);
        return "";
      } else {
        psh.proc_done = true;
        var output = psh.exit_return(this.parse_output(psh));
        psh.headline.headlines = undefined;
        return output;
      }

  }

  parse_output(psh) {

      if (psh.headline.headlines === undefined){
        psh.headline.headlines = [];
      }

      var output_strings = this.prefix_output;

      var parser = new DOMParser();
      var dom = parser.parseFromString(psh.output, 'text/xml');
      for (var i in dom.getElementsByTagName("item")){
        var item = dom.getElementsByTagName("item")[i];
        if (typeof item.getElementsByTagName === 'function' && item.getElementsByTagName("title") !== undefined ){
          var title = item.getElementsByTagName("title")[0].textContent;
          var link = item.getElementsByTagName("link")[0].textContent;
          if (!psh.headline.headlines.some((v) => v === title)){
              output_strings += '･ <a href="' + link + '" target="_blank">' + title + '</a>\r\n';
              psh.headline.headlines.push(title);
          }
        }
      }

      for (var i in dom.getElementsByTagName("entry")){
        var entry = dom.getElementsByTagName("entry")[i];
        if (typeof entry.getElementsByTagName === 'function' && entry.getElementsByTagName("title") !== undefined ){
          var title = entry.getElementsByTagName("title")[0].textContent;
          var link = entry.getElementsByTagName("link")[0].textContent;
          if (!psh.headline.headlines.some((v) => v === title)){
              output_strings += '･ <a href="' + link + '" target="_blank">' + title + '</a>\r\n';
              psh.headline.headlines.push(title);
          }
        }
      }

      return output_strings + this.suffix_output;
  }

}
