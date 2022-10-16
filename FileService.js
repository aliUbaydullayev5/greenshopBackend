const path = require('path')
const uuid = require('uuid')

class FileService{
    saveFile(file){
        try{
            const fileName = uuid.v4() + '.jpg'
            const pathName = path.resolve('static', fileName)
            file.mv(pathName)
            return fileName
        }catch (e) {
            console.log(e)
        }
    }
}

module.exports = new FileService()