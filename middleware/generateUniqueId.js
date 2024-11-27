function generateUniqueId(prefix, length) {
    const randomString = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
    return prefix + randomString;
}


module.exports= generateUniqueId