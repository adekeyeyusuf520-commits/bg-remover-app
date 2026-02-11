const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bgColor = document.getElementById("bgColor");
const downloadBtn = document.getElementById("downloadBtn");

let net;
let img;

async function loadModel() {
    net = await bodyPix.load();
    console.log("Model loaded");
}
loadModel();

upload.addEventListener("change", async () => {
    img = new Image();
    img.src = URL.createObjectURL(upload.files[0]);
    img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Remove background
        const segmentation = await net.segmentPerson(img);

        const mask = bodyPix.toMask(segmentation);
        ctx.putImageData(mask, 0, 0);

        // Draw image with transparent background
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
});

bgColor.addEventListener("change", () => {
    if (img) {
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    }
});

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "result.png";
    link.href = canvas.toDataURL();
    link.click();
});
