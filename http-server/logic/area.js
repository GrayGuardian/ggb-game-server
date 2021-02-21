module.exports = function (prototype) {
    prototype.getAreaInfoList = async function (username) {
        let rows = await mysql.queryAsync('SELECT * FROM area_info WHERE ISNULL(paid) ORDER BY create_time DESC');
        return rows;
    }
    
};