/*
Color Name	Foreground Color Code	Background Color Code
Black	30	40
Red	31	41
Green	32	42
Yellow	33	43
Blue	34	44
Magenta	35	45
Cyan	36	46
White	37	47
Default	39	49
Reset	0	0


Color Name	Foreground Color Code	Background Color Code
Bright Black	90	100
Bright Red	91	101
Bright Green	92	102
Bright Yellow	93	103
Bright Blue	94	104
Bright Magenta	95	105
Bright Cyan	96	106
Bright White	97	107
*/
// const yellowOnRedBold='\x1B[41;93;4m'
// 41 is red background    4m is underline  1m is bold
const yellowOnRedBold='\x1b[41;93;1m'
const yellowOnGreenBold='\x1b[33;42m'
const RESET='\x1b[0m'
// \x1b is a control character 
// By placing [33m after our initial control character, we switch the console output color to yellow

console.log("\n\n")
console.log("***** BASE TERMINAL EXAMPLES *****\n")

const BRIGHTRED='\x1b[91m'
const BRIGHTYELLOW='\x1b[93m'
const COLRESET='\x1b[0m'

console.log("- \\x1b[0m", "  | \x1b[0mReset\x1b[0m")
console.log("- \\x1b[1m", "  | \x1b[1mBold/Bright\x1b[0m")
console.log("- \\x1b[3m", "  | \x1b[3mItalic\x1b[0m")
console.log("- \\x1b[4m", "  | \x1b[4mUnderline\x1b[0m")
console.log("- \\x1b[7m", "  | \x1b[7mReverse\x1b[0m")
console.log("- \\x1b[8m", "  | \x1b[8mHidden\x1b[0m - hidden")
console.log("- \\x1b[9m", "  | \x1b[9mStrike-through\x1b[0m")

console.log("- \\x1b[30m", " | \x1b[30mBlack\x1b[0m")
console.log("- \\x1b[31m", " | \x1b[31mRed\x1b[0m")
console.log("- \\x1b[32m", " | \x1b[32mGreen\x1b[0m")
console.log("- \\x1b[33m", " | \x1b[33mYellow\x1b[0m")
console.log("- \\x1b[34m", " | \x1b[34mBlue\x1b[0m")
console.log("- \\x1b[35m", " | \x1b[35mMagenta\x1b[0m")
console.log("- \\x1b[36m", " | \x1b[36mCyan\x1b[0m")
console.log("- \\x1b[37m", " | \x1b[37mWhite\x1b[0m")

console.log("- \\x1b[40m", " | \x1b[40mBlack Background\x1b[0m")
console.log("- \\x1b[41m", " | \x1b[41mRed Background\x1b[0m")
console.log("- \\x1b[42m", " | \x1b[42mGreen Background\x1b[0m")
console.log("- \\x1b[43m", " | \x1b[43mYellow Background\x1b[0m")
console.log("- \\x1b[44m", " | \x1b[44mBlue Background\x1b[0m")
console.log("- \\x1b[45m", " | \x1b[45mMagenta Background\x1b[0m")
console.log("- \\x1b[46m", " | \x1b[46mCyan Background\x1b[0m")
console.log("- \\x1b[47m", " | \x1b[47mWhite Background\x1b[0m")

console.log("- \\x1b[90m", " | \x1b[90mBright Black\x1b[0m")
console.log("- \\x1b[91m", " | \x1b[91mBright Red\x1b[0m")
console.log("- \\x1b[92m", " | \x1b[92mBright Green\x1b[0m")
console.log("- \\x1b[93m", " | \x1b[93mBright Yellow\x1b[0m")
console.log("- \\x1b[94m", " | \x1b[94mBright Blue\x1b[0m")
console.log("- \\x1b[95m", " | \x1b[95mBright Magenta\x1b[0m")
console.log("- \\x1b[96m", " | \x1b[96mBright Cyan\x1b[0m")
console.log("- \\x1b[97m", " | \x1b[97mBright White\x1b[0m")

console.log("- \\x1b[100m", "| \x1b[100mBright Black Background\x1b[0m")
console.log("- \\x1b[101m", "| \x1b[101mBright Red Background\x1b[0m")
console.log("- \\x1b[102m", "| \x1b[102mBright Green Background\x1b[0m")
console.log("- \\x1b[103m", "| \x1b[103mBright Yellow Background\x1b[0m")
console.log("- \\x1b[104m", "| \x1b[104mBright Blue Background\x1b[0m")
console.log("- \\x1b[105m", "| \x1b[105mBright Magenta Background\x1b[0m")
console.log("- \\x1b[106m", "| \x1b[106mBright Cyan Background\x1b[0m")
console.log("- \\x1b[107m", "| \x1b[107mBright White Background\x1b[0m")

console.log("\n***** 24-BIT RGB COLOR EXAMPLES *****\n")
console.log("- \\x1b[38;2;150;56;78m", "| \x1b[38;2;150;56;78mCustom RGB 'Rose' Font\x1b[0m")
console.log("- \\x1b[38;2;229;255;0m", "| \x1b[38;2;229;255;0mCustom RGB 'Yellow' Font\x1b[0m")

console.log("\n***** 256-COLOR (8-BIT) COLOR EXAMPLES *****\n")

console.log("- \\x1b[48;5;49m", "| \x1b[48;5;49mMint Background\x1b[0m")
console.log("- \\x1b[48;5;45m", "| \x1b[48;5;45mCyan Background\x1b[0m")
console.log("- \\x1b[38;5;33m", "| \x1b[38;5;33mBlue Font\x1b[0m")
console.log("- \\x1b[38;5;61m", "| \x1b[38;5;61mPurple Font\x1b[0m")

console.log("\n\n")
