const seedColor = document.getElementById("seed-color")
const schemeMode = document.getElementById("scheme-mode")
const getSchemeBtn = document.getElementById("get-scheme-btn")
const colors = document.getElementById("colors")

seedColor.addEventListener("input", getValues)
schemeMode.addEventListener("change", getValues)
getSchemeBtn.addEventListener("click", function(e){
    e.preventDefault()
    getColorScheme()
})

// event listener for the default color codes after the DOM loads
document.addEventListener("DOMContentLoaded", () => {
    copyDefaultColorCode()
})

function copyDefaultColorCode() {
    const defaultColorContainers = document.querySelectorAll(".color-container")
    defaultColorContainers.forEach(container => {
        const colorCodeParagraph = container.querySelector(".color-code")
        const codeWrapper = container.querySelector(".code-wrapper")
        colorCodeParagraph.addEventListener("click", function() { copyColorCode(this, codeWrapper) })
    })
}

function getValues() {
    const colorValue = seedColor.value.slice(1) //start extracting the color code starting from the 1st index (omitting the '#')
    const scheme = schemeMode.value.toLowerCase()  
    return { colorValue, scheme } //turn colorValue and scheme into an object to be able to access them both later
}

function getColorScheme() {
    const { colorValue, scheme } = getValues()
    fetch(`https://www.thecolorapi.com/scheme?hex=${colorValue}&mode=${scheme}&count=5`)
        .then(response => response.json())
        .then(data => {
            const colorsArr = data.colors
            handleColorContainers(colorsArr)
        })
}

function handleColorContainers(colorsArr) {
    //generate HTML for new color-containers with corresponding color codes
    let html = ""
    colorsArr.forEach((color, index) => {
        html += `
        <div class="color-container" id="color-${index + 1}">
            <div class="code-wrapper">
                <p class="color-code">${color.hex.value}</p>    
            </div>
        </div>
        `
    })
    colors.innerHTML = html
    colorsArr.forEach((color, index) => {
        const colorDiv = document.getElementById(`color-${index + 1}`)
        //apply background color to each color-container's CSS id selector
        colorDiv.style.backgroundColor = `${color.hex.value}` 

        //listen for clicks on the color code paragraph and copy it to clipboard
        const colorCodeParagraph = colorDiv.querySelector(".color-code")
        const codeWrapper = colorDiv.querySelector(".code-wrapper")
        colorCodeParagraph.addEventListener("click", function() { copyColorCode(this, codeWrapper) })
    })
}

function copyColorCode(paragraph, codeWrapper) {
    if (paragraph.textContent !== "") {
        const hexValue = paragraph.textContent        
        navigator.clipboard.writeText(paragraph.textContent)
        paragraph.classList.add("copied")
        codeWrapper.classList.add("copied")
        paragraph.textContent = "Copied!"

        setTimeout(() => {
            paragraph.classList.remove("copied")
            codeWrapper.classList.remove("copied")
            paragraph.textContent = hexValue
        }, 1100)
    }
}