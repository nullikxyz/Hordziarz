const colors = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37
}

function colorString(string, color, background = false, bold = false, underline = false) {
    if(!colors[color]) return string;

    return `\x1b[${background ? 4 : 0};${bold ? 1 : 0};${underline ? 4 : 0};${colors[color]}m${string}\x1b[0m`
}

module.exports = colorString;