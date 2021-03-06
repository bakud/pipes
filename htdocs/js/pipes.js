import pipes_shell from './libs/psh.js';

// start pipes.
var history_key = "hst";
var default_value = "anon@pipes$ ";
var psh = new pipes_shell();
var q;
var drawing;
var margin;
var all;
var default_font_size = "1.5vh";
var ctlkey_pressed    = false;
var history_count     = -1;
var current_input     = "";
var title_ascii_art   = (function() {/*
  ______   __     ______   ______     ______
 /\  == \ /\ \   /\  == \ /\  ___\   /\  ___\
 \ \  _-/ \ \ \  \ \  _-/ \ \  __\   \ \___  \
  \ \_\    \ \_\  \ \_\    \ \_____\  \/\_____\
   \/_/     \/_/   \/_/     \/_____/   \/_____/

                                  version 0.9.0
*/}).toString().match(/\/\*([^]*)\*\//)[1];

function Init() {

    init_behavior();
    init_all();
    init_drawing_area();
    init_title();
    init_input_area();
    init_margin_area();
    set_theme();
    psh.set_pipes_obj({
      default_value,
      std_out,
      html_out,
      drawing,
      post_psh_proc,
      clear_q,
      focus_to_bottom,
      save_history
    });

};

var init_margin_area = function () {
    margin = document.createElement('div');
    all.appendChild(margin);
    margin.style.height = "20px";
};

var init_behavior = function () {
    // to invalid back of history.
    history.pushState(null, null, null);
    window.addEventListener('popstate', function(e) {
        history.pushState(null, null, null);
    });
    document.getElementById('viewport').setAttribute('content', 'user-scalable=no, width=device-width, initial-scale=0.8');
};

var init_title = function () {
    drawing.innerText += title_ascii_art;
};

var set_theme = function (){

    const background_color = "#191919";
    const text_color = "#7fe000";
    // set theme to body.
    document.body.style.backgroundColor = background_color;
    document.body.style.color = text_color;

    // set theme to input area
    q.style.backgroundColor = background_color;
    q.style.color = text_color;

    // set a css
    var css = 'a:link{color:' + text_color + '} a:visited{color:' + text_color + '} a:hover{color:' + text_color + '} a { text-decoration: none;}';
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

};

var init_all = function (){
    all = document.createElement('div');
    document.body.appendChild(all);
    all.style.overflowY  = "scroll";
    all.style.bottom     = "25px";
    all.style.fontFamily = "Andale Mono, Courier New, Courier, monospace";
    all.style.whiteSpace = "pre-wrap";
    all.style.fontSize   = default_font_size;
};

var init_drawing_area = function(){
    drawing = document.createElement('div');
    all.appendChild(drawing);
};

var init_input_area  =  function(){

    q      = document.createElement('input');
    all.appendChild(q);
    q.setAttribute('spellcheck',false);
    q.style.borderWidth  = "0px";
    q.style.bottom       = "5px";
    q.style.width        = "98%";
    q.style.fontFamily   = "Andale Mono, Courier New, Courier, monospace";
    q.style.whiteSpace   = "pre";
    q.style.fontSize     = default_font_size;
    q.style.outlineWidth = "0px";
    q.style.outline      = "none";
    q.value = default_value;
    q.focus();

    // turn off cut action.
    document.addEventListener('cut', (event) => {
        event.preventDefault();
    }, {passive: false});
    q.addEventListener("paste", function(event){
      q.focus();
      if ( q.selectionStart >= 0 || q.selectionEnd >= 0 ){
          set_text(event.target.value, q);
          return;
      }
    });

    // turn off several input of key
    document.addEventListener('keydown', (event) => {
        console.log("pushed");
        if ((event.key === "ArrowUp" || event.key === "ArrowDown") && q.selectionStart >= default_value.length) {
          event.preventDefault();
          q.setSelectionRange(q.value.length, q.value.length);
          var direct = event.key === "ArrowUp" ? "up" : "down";
          change_history(direct);
          return;
        }
        if (event.ctrlKey) { ctlkey_pressed = true; }
        if (ctlkey_pressed && event.key === 'c') { psh.abort_proc(); }
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey && q.selectionStart >= default_value.length) {
          q.focus();
          setTimeout(post_keydown(event, q), 0);
        }
    }, {passive: false});

    // turn off several input of key
    document.addEventListener('keyup', (event) => {
        if (event.ctrlKey) { ctlkey_pressed = false; }
    }, {passive: false});

    // turn off click action.
    q.addEventListener("click", function() {
        if (q.selectionStart <= default_value.length){
          q.setSelectionRange(default_value.length, default_value.length);
          return;
        }
    });

    document,addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && q.selectionStart >= default_value.length) {
          pressed_enter();
          return;
        }
    }, {passive: false});
};

var pressed_enter = function () {
    var input_text = q.value;
    std_out(input_text + "\r\n");
    clear_q();
    setTimeout(function () {psh.psh_proc(input_text);},"50");
};

var save_history = function(cmd) {
    if(cmd === "") return;
    var history = JSON.parse(localStorage.getItem(history_key));
    if (history == null) { history = []; }
    history.push(cmd);
    localStorage.setItem(history_key, JSON.stringify(history));
};

var get_history = function(){

    if ( history_count === -1 ){
      return current_input;
    } else {
      var history = JSON.parse(localStorage.getItem(history_key));
      if ( history == null) {
        history_count = -1;
        return undefined;
      } else if (history[history_count] === undefined ) {
        history_count =  history_count - 1;
        return undefined;
      }

      var output_history = history.reverse()

      return output_history[history_count];
    }
}

var clear_q = function () {
    q.value = "";
    q.focus();
};

var post_psh_proc = function (){
    q.value = default_value;
    q.focus();
    focus_to_bottom();
};

var focus_to_bottom = function (){
    var element = document.documentElement;
    var bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
};

var std_out = function(output){
    clear_q();
    var div = get_div();
    div.innerText = output;
    drawing.appendChild(div);
};

var html_out = function(output){
    clear_q();
    var div = get_div();
    div.innerHTML = output;
    drawing.appendChild(div);
};

var get_div = function(){
    var div = document.createElement('div');
    div.style.lineHeight = 1.5;
    return div;
};

var set_text = function (text,q) {
    var textEvent = document.createEvent('TextEvent');
    textEvent.initTextEvent ('textInput', true, true, null, text, 1, "en-US");
    document.getSelection().removeAllRanges();
    document.getSelection().empty();
    q.setSelectionRange(q.value.length, q.value.length);
    q.dispatchEvent( textEvent );
};

var change_history = function (direct){
    if (direct === "up"){ history_count++; }
    else if(direct === "down") {
      history_count--;
      if (history_count < -1) {  history_count = -1;}
    }
    var history_line = get_history();
    if (history_line === undefined) { return; }
    q.value = default_value + history_line;
    q.setSelectionRange(q.value.length, q.value.length);
}

var post_keydown = function (event, q) {

    if(document.getSelection().toString() !== "" && document.activeElement === q && q.selectionStart >= default_value.length){
      set_text(event.key, q);
      return;
    }

    // set arroleft behavior.
    if (event.key === "ArrowLeft" && q.selectionStart >= default_value.length){
      event.preventDefault();
      return false;
    }

    if (event.keyCode == 8 || event.keyCode == 46){
      // check default value length.
      if (q.value.length <= default_value.length){
        event.preventDefault();
        return false;
      }
    }

    if (q.selectionStart < default_value.length){
      event.preventDefault();
      return false;
    }

}

Init();
