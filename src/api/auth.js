const name = 'user-token'
const setuser = function(key) {
    return window.sessionStorage.setItem(name ,JSON.stringify(key))
}
const getuser = function() {
    return JSON.parse(window.sessionStorage.getItem(name) || '{}')
}
const deletuser = function () {
    return window.sessionStorage.removeItem(name)
}

export default {
    setuser,
    getuser,
    deletuser
}