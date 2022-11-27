const syntaxKeywords = { "key": ["not", "or", "and", "def", "true", "false"], "languagekey": ["if", "else", "elif", "for", "in", "import", "with", "as", "from"], "defaultkey": ["+", "-", "/", "*", "=", "(", ")", "[", "]", "{", "}"], "object": ["str", "int", "float", "range"]}

const { key, languagekey, defaultkey, object } = syntaxKeywords

const textarea = document.querySelector('textarea')
const display = document.getElementById('display')

String.prototype.escape = function (charactersToEscape) {
    return escapeChars(this, charactersToEscape)
}

displayCode()
reloadColors()

textarea.addEventListener('scroll', e => {
    display.scrollTo(e.target.scrollLeft, e.target.scrollTop)
})

textarea.setAttribute("tabindex", 1);

textarea.addEventListener('input', displayCode)
textarea.addEventListener('keydown', event => {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    console.log('test');
    if (event.key === 'Tab') {
        event.preventDefault()

        
        
        if (start == end) {
            textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end)
            textarea.selectionStart = start + 4
            textarea.selectionEnd = end + 4
        }else{
            // let toReplaceText = textarea.value.substring(start, end).replace(/\n/g, '\n    ')

            // textarea.value = textarea.value.substring(0, start) + '    ' + toReplaceText.replace(/\n/g, '\n    ') + textarea.value.substring(end)
            // textarea.selectionStart = start
            // textarea.selectionEnd = start + toReplaceText.replace(/\n/g, '\n    ').length + 4
            // console.log();
        }


    }

    doubleChar(event, '()', start, end)
    doubleChar(event, '[]', start, end)
    doubleChar(event, '{}', start, end)
    doubleChar(event, "''", start, end)
    doubleChar(event, '""', start, end)
    doubleChar(event, '``', start, end)

    if (event.key === 'Backspace' && (textarea.value.charAt(start - 1) + textarea.value.charAt(start) == '()' || textarea.value.charAt(start - 1) + textarea.value.charAt(start) == '[]' || textarea.value.charAt(start - 1) + textarea.value.charAt(start) == '{}' || textarea.value.charAt(start - 1) + textarea.value.charAt(start) == "''" || textarea.value.charAt(start - 1) + textarea.value.charAt(start) == '""' || textarea.value.charAt(start - 1) + textarea.value.charAt(start) == '``')){
        textarea.value = textarea.value.substring(0, start - 1) + textarea.value.substring(start + 1)

        textarea.selectionStart = start - 1
        textarea.selectionEnd = end - 1

        event.preventDefault()
    }

    if (event.key === 'Enter' && textarea.value.charAt(start - 1) + textarea.value.charAt(start) == '{}'){
        textarea.value = textarea.value.substring(0, start) + '\n    \n' + textarea.value.substring(end)
        
        textarea.selectionStart = textarea.selectionStart - 2
        textarea.selectionEnd = textarea.selectionEnd - 2

        event.preventDefault()
    }

    displayCode()
})


textarea.onkeydown = function (event) {
    console.log(event);
}



function displayCode() {
    let coloredText = textarea.value.replace(/\n/g, '<br>')

    coloredText = colorizeKeywords(coloredText, languagekey, 'lkey');
    coloredText = colorizeKeywords(coloredText, key, 'key');
    coloredText = colorizeKeywords(coloredText, object, 'obj');

    coloredText = colorizeKeysByRegExp(coloredText, /(\w+)(?= {0,}\()/g, 'fun')
    coloredText = colorizeKeysByRegExp(coloredText, /\d+/g, 'num')
    coloredText = colorizeStrings(coloredText, 'str')

    
    coloredText = colorizeComments(coloredText, 'com')


    display.children[0].innerHTML = coloredText
}


function colorizeKeywords(text, keywords, coloration) {
    let replacedText = text

    let regexValue = ''
    keywords.forEach(keyword => regexValue += `(?<!["\'\`\\w<])(${keyword})(?!["\'\`\\w>])|`)
    regexValue = regexValue.slice(0, -1)
    let regex = new RegExp(regexValue, 'g')

    replacedText = replacedText.replace(regex, (keyword) => `<${coloration}>${keyword}</${coloration}>`)

    return replacedText
}



function colorizeKeysByRegExp(text, regexp, coloration) {
    let replacedText = text 
    let foundKeys = text.match(regexp)

    if (!foundKeys) return text

    let regexValue = '';
    foundKeys.forEach(key => regexValue += `(?<!["\'\`\\w<])(${key})(?!["\'\`\\w>])|`)
    regexValue = regexValue.slice(0, -1)
    let regex = new RegExp(regexValue, 'g')

    replacedText = replacedText.replace(regex, (key) => `<${coloration}>${key}</${coloration}>`)
    
    return replacedText
}


function colorizeStrings(text, coloration) {
    let replacedText = text
    let foundKeys = text.match(/(?<!(<))("(((?!((?<!\\)")).)*)+"|'(((?!((?<!\\)')).)*)+'|`(((?!((?<!\\)`)).)*)+`)(?!(>))/g)

    if (!foundKeys) return text

    let regexValue = '';
    foundKeys.forEach(key => regexValue += `(?<!(<))(${ key.escape('^$()<.*+{\\|>[?') })(?!(>))|`)
    regexValue = regexValue.slice(0, -1)
    let regex = new RegExp(regexValue, 'g')

    replacedText = replacedText.replace(regex, (key) => `<${coloration}>${key}</${coloration}>`)
    
    return replacedText
}



function colorizeVariables(text, coloration) {

}



function colorizeComments(text, coloration) {
    let replacedText = text
    let lines = replacedText.split('<br>')

    lines.forEach(line => {
        if (line.includes('//')) {
            let splittedLine = '//' + line.split('//')[1]

            replacedText = replacedText.replace(new RegExp(splittedLine.escape('^$()<.*+{\\|>[?'), 'g'), `<${coloration}>${splittedLine}</${coloration}>`)
        }
    })

    return replacedText
}



function doubleChar(event, char, start, end) {
    console.log('test');
    if (!(event.key.toString() === char[0].toString() && (event.target.value.charAt(start) == '' || event.target.value.charAt(start) == '\n' || event.target.value.charAt(start) == ' '  || event.target.value.charAt(start) == ')' || event.target.value.charAt(start) == '{' || event.target.value.charAt(start) == '}' || event.target.value.charAt(start) == '('))) return console.log('not placed correctly');
    if (start == end) {
        console.log('start == end');
        textarea.value = textarea.value.substring(0, start) + char[0] + char[1] + textarea.value.substring(end)

        textarea.selectionStart = start + 1
        textarea.selectionEnd = end + 1
    } else {
        console.log('start != end');
        textarea.value = textarea.value.substring(0, start) + char[0] + textarea.value.substring(start, end) + char[1] + textarea.value.substring(end)

        textarea.selectionStart = end + 1
        textarea.selectionEnd = end + 1
    }

    event.preventDefault()
    
}



function reloadColors() {
    document.documentElement.style.setProperty('--color-1', "#" + ((1 << 24) * Math.random() | 0).toString(16));
    document.documentElement.style.setProperty('--color-2', "#" + ((1 << 24) * Math.random() | 0).toString(16));
}



function escapeChars (str, chars) {
    let charactersToEscape = '\\'+[...chars].join('|\\')
    let newStr = [...str].join('')

    let foundChars = newStr.match(new RegExp(charactersToEscape, 'g'))
    
    if(!foundChars) return newStr
    
    foundChars.forEach(char => {
        newStr = newStr.replace(new RegExp('(?<!\\\\)(\\'+char+')', 'g'), '\\'+ char)
    })

    return newStr
}