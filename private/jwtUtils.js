const {decodeJwt, SignJWT, jwtVerify} = require("jose");
const {JWT, User} = require("../db/models");
const accessSecret = new TextEncoder().encode(
    'IckmATNnVyRkUggTy3oeJZmsfvcgTNe5Axw0rKHo4t8MP+MaDg+FgG3UtjcHuLIsR+9MSjCzSiz2DSG0eXQeOw==',
)

const refreshSecret = new TextEncoder().encode(
    'FtTg1magrHBvioaLjybIaNlzK4TTesA9bdw6ZVX8LJxgx7kYoV2HeYoJxuo0NvKSEVhyE2AySfiX/4Dmhe6oAA==',
)
const alg = 'HS512'

async function createJWT(user) {
    return {
        accessToken: await new SignJWT(user)
            .setProtectedHeader({alg})
            .setIssuedAt()
            .setIssuer('hackcraft_')
            .setExpirationTime('15m')
            .sign(accessSecret),
        refreshToken: await new SignJWT(user)
            .setProtectedHeader({alg})
            .setIssuedAt()
            .setIssuer('hackcraft_')
            .setExpirationTime('30m')
            .sign(refreshSecret),
    };
}

function jwtChecker() {
    return async function (req, res, next) {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        // if there are no tokens, redirect to register
        if (!accessToken || !refreshToken) {
            res.redirect('/account/register');
            return;
        }


        try {
            if (await jwtVerify(accessToken, accessSecret, {issuer: 'hackcraft_'})) {
                // if the access token is valid, continue
                req.username = (await decodeJwt(accessToken)).username;
                req.user = await User.findOne({where: {username: req.username}});
                next();
            }
        } catch (e) {
            try {
                if (await jwtVerify(refreshToken, refreshSecret, {issuer: 'hackcraft_'})) {
                    const dbRefreshToken = await JWT.findOne({where: {refreshToken}});
                    if (dbRefreshToken) {
                        // if the refresh token is valid, create a new access token and continue
                        const decoded = await decodeJwt(refreshToken);
                        const newTokens = await createJWT({username: decoded.username});

                        await JWT.destroy({where: {refreshToken}});

                        res.cookie('accessToken', newTokens.accessToken, {httpOnly: true});
                        res.cookie('refreshToken', newTokens.refreshToken, {httpOnly: true});

                        await JWT.create({refreshToken: newTokens.refreshToken});

                        req.username = (await decodeJwt(accessToken)).username;
                        req.user = await User.findOne({where: {username: req.username}});
                        next();
                    }
                }
            } catch (e) {
                // if the refresh token is expired, redirect to register
                console.log(e)
                res.redirect('/account/login');
            }
        }
    };
}

module.exports = {createJWT, jwtChecker};