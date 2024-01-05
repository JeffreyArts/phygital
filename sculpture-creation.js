import phygital from "Phygital"

let satisfied = false
let foamBlocks = Math.floor(Math.random()* 128) + 16
let digitalSculpture = undefined

// Design sculpture
while (satisfied != true) {
    const tempSculpture = digitalSculpture ? digitalSculpture.digital : null
    digitalSculpture = phygital.tryGeneratingSculpture(tempSculpture)
    if (digitalSculpture.happyWithResult) {
        satisfied = true
    }
}

if (!digitalSculpture) {
    throw new Error("Missing sculpture")
}

// Building negative
while (digitalSculpture.foamBlocks > foamBlocks) {
    foamBlocks++
}
const negativeSculpture = phygital.createNegative(digitalSculpture, foamBlocks)
negativeSculpture.addFinishing("Vaseline")

// Pouring mould
const portlandCement = digitalSculpture.height / 2
const sand = portlandCement/2
const water = sand / 2
const pigmentPowder =  portlandCement / 20

const mould = phygital.assembleMould(digitalSculpture.height, digitalSculpture.width, digitalSculpture.depth)

const physicalSculpture = phygital.pour(negativeSculpture, {
    mould, portlandCement, sand, water, pigmentPowder
})

// Finishing sculpture
physicalSculpture.addNametag("JA", new Date().getFullYear() )
const pictures = physicalSculpture.takePictures(Math.ceil(Math.random(16)) + 16)
pictures.forEach(picture => {
    picture.colorAdjust()
    picture.resize()
    picture.rename()
})
physicalSculpture.publish("Artmajeur", pictures)
   