module.exports = function (prototype) {
    prototype.getAreaInfoList = async function () {
        let rows = await mysql.queryAsync('SELECT * FROM area_info WHERE ISNULL(paid) ORDER BY create_time DESC');
        return rows;
    }
    prototype.getAreaInfo = async function (aid) {
        let rows = await mysql.queryAsync('SELECT * FROM area_info WHERE aid = ? AND ISNULL(paid) ORDER BY create_time DESC', [aid]);
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }

};