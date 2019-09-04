const getCurrentTimestamp = Math.round(new Date().getTime()/1000)

const generateToken = (length) => {
    // allowed characters in the generated token
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!$%^&*@?#[]<>".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

module.exports = {
    generateToken,
    getCurrentTimestamp,
}