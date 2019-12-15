const { ipcRenderer } = require('electron')

let btn_choose_zip = document.querySelector("#btn-choose-zip")
let btn_start_grading = document.querySelector('#btn-start-grading')
let btnNextSubmission = document.querySelector('#btn-next-submission')

let txtTargetFile = document.querySelector("#txt-target-file")

let btn2 = document.querySelector("#btn2")

let p = document.querySelector("#reply")
let selectedZip = document.querySelector("#selected-zip")

let htmlView = document.querySelector('#html-view')

btn_choose_zip.addEventListener('click', () => {
    zipName = ipcRenderer.sendSync('choose-directory')
    selectedZip.innerHTML = zipName
})

btn_start_grading.addEventListener('click', () => {
    // check if fields are filled out
    // or disable button to filled out

    targetFile = txtTargetFile.value

    ipcRenderer.sendSync('start-grading', targetFile)

    showSubmission()
})


btnNextSubmission.addEventListener('click', () => {
    showSubmission()
})

btn2.addEventListener('click', () => {
    ipcRenderer.sendSync('debug')
})

function showSubmission() {
    data = ipcRenderer.sendSync('get-submission-data')

    p.innerHTML = `now grading ${data[0]}!`
    htmlView.src = data[1]
}
