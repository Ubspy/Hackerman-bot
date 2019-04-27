var toggle = true; // turn logger on/off.
var colors = {
  "RED": "\x1b[31m",
  "GREEN": "\x1b[32m",
  "YELLOW": "\x1b[33m",
  "BLUE": "\x1b[34m",
  "PURPLE": "\x1b[35m",
  "WHITE": "\x1b[37m"
}
module.exports = (fileName, color = "WHITE") => {
  let name = fileName
  let time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  return (head, body) => {
    if (color == undefined)(body != undefined ? console.log(`[${time}] ` + name + ": " + head, body) : console.log(name + ": " + head))
    else {
      body != undefined ? console.log(colors[color.toUpperCase()], `[${time}] ` + head, body) : console.log(colors[color.toUpperCase()], `[${time}] ` + name + ": " + head)
    }
  }
}

