const blessed = require('blessed');
const options = globalThis.options

const screen = blessed.screen({
  smartCSR: true,
  title: options.username,
});

let statusbar = blessed.box({
	top: '',
	left: '',
  width: '100%',
  height: 3,
  content: `{bold}${options.username}{/bold} is connected to {bold}${options.host}{/bold} on {bold}${options.version}{/bold}`,
  tags: true,
  align: 'center',
  border: {
    type: 'line',
  },
  style: {
    border: {fg: 'blue'},
  },
});

let chatBox = blessed.box({
  top: 3,
  left: '',
  width: '100%',
  height: '100%-6',
  label: 'Chat',
  scrollable: true,
  alwaysScroll: true,
  mouse: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'cyan'
    },
    style: {
      inverse: true
    }
  },
  border: {
    type: 'line',
  },
  style: {
    border: {fg: 'green'},
  },
});

let inputBox = blessed.textbox({
  bottom: '0',
  left: '0',
  width: '100%',
  label: 'Input',
  height: 3,
  inputOnFocus: true,
  clickable: true,
  border: { type: 'line' },
  style: {
    border: {fg: 'green'},
    focus: { border: { fg: "green" } }
  }
});

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', ',', '.', '/', '\\', ';', "'", '[', ']', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

screen.append(statusbar);
screen.append(chatBox);
screen.append(inputBox);
inputBox.focus();
screen.key(['q', 'C-c'], () => process.exit(0));
inputBox.key(['up'], () => chatBox.scroll(-1))
inputBox.key(['down'], () => chatBox.scroll(1))
inputBox.key(['C-q'], () => process.exit(0))
inputBox.on('blur', () => setTimeout(() => {
  inputBox.focus()
  screen.render()
}, 1));

inputBox.on('submit', (value) => {
  inputBox.clearValue();
  globalThis.messageEXE(globalThis.bot, value)
  screen.render();
});

module.exports = {
  screen,
  chatBox,
  inputBox,
};
