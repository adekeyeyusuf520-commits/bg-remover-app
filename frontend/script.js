const upload = document.getElementById("upload");
const removeBtn = document.getElementById("removeBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bgColor = document.getElementById("bgColor");
const downloadBtn = document.getElementById("downloadBtn");

let foregroundImage = null;

removeBtn.onclick = async () => {

    if(upload.files.length === 0){
        alert("Select an image first!");
        return;
    }

    const formData = new FormData();
    formData.append("image", upload.files[0]);

    const response = await fetch("http://127.0.0.1:5000/remove-bg", {
        method: "POST",
        body: formData
    });

    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        foregroundImage = img;
        drawImage();
    }
};

function drawImage(){
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(foregroundImage){
        ctx.drawImage(foregroundImage,0,0);
    }
}

bgColor.onchange = drawImage;

downloadBtn.onclick = () => {
    const link = document.createElement("a");
    link.download = "result.png";
    link.href = canvas.toDataURL();
    link.click();
};
