const path = require('path');
const fs = require('fs');
const deleteUploadFilefunc = (file) => {
    if (file) {
        console.log(file.filename);
        const filePath = path.join(__dirname, '../public/images', file.filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("Unable to delte file" + err);
            }
        })
    }
}

module.exports = deleteUploadFilefunc;