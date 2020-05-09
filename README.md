# pipes
[http://pipes.ooo](http://pipes.ooo)

## Description
pipes works as CLI on browser.  
It reproduces the feel of a terminal-like operation, but doesn't behave as a UNIX.  
Instead, I plan to add a UNIX-like command in BINS as a command in the browser. 
Basically, I wanted to bring the power of PIPE in UNIX to the browser.  
  
`wcat http://rss.cnn.com/rss/cnn_topstories.rss | headline -t`  
  
<img width="1017" alt="スクリーンショット 2020-05-09 20 57 06" src="https://user-images.githubusercontent.com/661905/81473241-110b5280-9238-11ea-874b-68454baaf760.png">

## Usage
now available bins
- clear : Clear the screen.
- wcat : Outputs the source of the URL given in the argument.
- headline : Displays the title and URL of the input string side by side. Currently, only XML is supported, and it will be continuously updated if the -t option is added.
