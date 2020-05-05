export default class headline {

  constructor(pipes) {
    this.pipes  = pipes;
    this.output_type = "html";
  }

  main(args, output){

    if (output === undefined){ return ""; }

    var output_strings = '<div style="font-weight: bold;">';

    var parser = new DOMParser();
    var dom = parser.parseFromString(output, 'text/xml');
    for (var i in dom.getElementsByTagName("item")){
      var item = dom.getElementsByTagName("item")[i];
      if (typeof item.getElementsByTagName === 'function' && item.getElementsByTagName("title") !== undefined ){
        var title = item.getElementsByTagName("title")[0].textContent;
        var link = item.getElementsByTagName("link")[0].textContent;
        output_strings += '･ <a href="' + link + '" target="_blank">' + title + '</a>\r\n';
      }
    }

    for (var i in dom.getElementsByTagName("entry")){
      var entry = dom.getElementsByTagName("entry")[i];
      if (typeof entry.getElementsByTagName === 'function' && entry.getElementsByTagName("title") !== undefined ){
        var title = entry.getElementsByTagName("title")[0].textContent;
        var link = entry.getElementsByTagName("link")[0].textContent;
        output_strings += '･ <a href="' + link + '" target="_blank">' + title + '</a>\r\n';
      }
    }

    return output_strings + '</div>';

  }

}
