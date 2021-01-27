//const notUrls = ['/user/login', '/user/register'];
module.exports = async (ctx, next) => {
    // let url = ctx.originalUrl;
    // if (notUrls.indexOf(url) != -1) {
    //     next();
    //     return;
    // }
    // console.log('token检测', url);
    next();
};