import { db, firebase } from '../fbadim/fb-hook'


module.exports.verifyOnwer = async (req, res, next) => {
    const token = req.token
    const { deviceID, userAccount } = req.body

    // console.log(token)
    try {
        const { uid, name } = await firebase.auth().verifyIdToken(token);
        const docs = db.collection("ownDevice").where("auth", "==", uid).where('deviceID', "==", deviceID);
        docs.get().then(async (doc) => {
            console.log(doc.size)
            if (doc.size > 0) {
                console.log(userAccount)
                try {
                    const userRecord = await firebase.auth().getUserByEmail(userAccount)
                    console.log(userRecord.uid)
                    req.body.owner = name;
                    req.body.auth = userRecord.uid;
                    next();
                } catch (err) {
                    console.log("loi ne he", err)
                    res.send({
                        success: false,
                        message: err
                    });
                    return;
                }


            } else {
                console.log("No device");
                res.send({
                    success: false,
                    message: 'device does not exits'
                });
                return;
            }
        })

    } catch (err) {
        console.log("loi ne", err)
        res.send({
            success: false,
            message: err
        });
        return;
    }

}


module.exports.ownerBCUser = async (req, res) => {
    console.log("do roi ne")
    const token = req.token
    const { userAccount, deviceType, channelID } = req.body
    const colectionName = deviceType === 'own' ? 'ownDevice' : 'refDevices';
    try {
        const { uid } = await firebase.auth().verifyIdToken(token);
        const docs = db.collection(colectionName).where("auth", "==", uid).where('bcUser', "==", userAccount).where('bcChannel', '==', channelID);
        docs.get().then(async (doc) => {
            console.log(doc.size)
            if (doc.size > 0) {
                next();
            } else {
                res.send({
                    success: false,
                    message: `${userAccount} does not exist`
                });
                return;
            }
        })
    } catch (err) {
        console.log("loi ne", err)
        res.send({
            success: false,
            message: err
        });
        return;
    }
}