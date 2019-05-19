var toggle = true; // turn logger on/off.

// Object that holds specific color values
var colors =
{
  "RED": "\x1b[31m",
  "GREEN": "\x1b[32m",
  "YELLOW": "\x1b[33m",
  "BLUE": "\x1b[34m",
  "PURPLE": "\x1b[35m",
  "WHITE": "\x1b[37m"
}

// When imported, returns a function that needs a fileName and a color
module.exports = (fileName, color = "WHITE") =>
{
  // This could also be "var name = filename" it doesn't make a difference
  let name = fileName

  // This is a string formatter, so it's always in the same format
  let time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

  // Returns a function that has a head and a body part of the message
  return (head, body) =>
  {
    if (color == undefined)
    {
      // This console.log is fun, the ${time} returns the formatted time string, and the ticks are ways of appending onto a string
      // so it's the same as '[' + ${time} + ']' the rest is pretty self explanatory
      body != undefined ? console.log(`[${time}] ` + name + ": " + head, body) : console.log(`[${time}] ` + name + ": " + head)
    }
    else
    {
      // This does the same thing, but uses the colors specified before
      body != undefined ? console.log(colors[color.toUpperCase()], `[${time}] ` + head, body) : console.log(colors[color.toUpperCase()], `[${time}] ` + name + ": " + head)
    }
  }
}

