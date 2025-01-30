async function imageDataFromBase64(qrCodeImageBase64) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = qrCodeImageBase64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            resolve(imageData);
        };
        img.onerror = (error) => reject(error);
    });

};
const extractLink = async (qrCodeImageBase64) => {
const imageData = await imageDataFromBase64(qrCodeImageBase64);
const png = imageData.data;
// decode QR code
const code = jsQR(png, imageData.width, imageData.height);
const qrCodeText = code?.data;
return qrCodeText;
}