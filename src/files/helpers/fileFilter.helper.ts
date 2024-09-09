export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback( new Error('File is empty'), false);

    const fileExtension = file.mimetype.split("/")[1];
    const valideExtensions = ['jpg', 'jpeg', 'png', 'gif', 'web'];

    if(!valideExtensions.includes( fileExtension ) ) {
        return callback(new Error('Extension not allowed.'), false);
    } 

    callback(null, true);

}