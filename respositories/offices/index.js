// Import Models Object

const { officeModel, adminModel, userModel } = require("../../models");

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const { getSuitableTranslations } = require("../../helpers/translation");

async function getOfficesCount(authorizationId, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get Stores Count Process Has Been Successfully !!", language),
                    error: false,
                    data: await officeModel.countDocuments(filters),
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getAllOfficesInsideThePage(authorizationId, pageNumber, pageSize, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get All Offices Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        offices: await officeModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ creatingOrderDate: -1 }),
                        officesCount: await officeModel.countDocuments(filters)
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getOfficeDetails(authorizationId, officeId, userType, language) {
    try {
        const user = userType === "user" ? await userModel.findById(authorizationId) : await adminModel.findById(authorizationId);
        if (user) {
            const office = await officeModel.findById(officeId);
            if (office) {
                return {
                    msg: getSuitableTranslations("Get Details For This Office Process Has Been Successfully !!", language),
                    error: false,
                    data: office,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getMainOfficeDetails(authorizationId, language) {
    try {
        const user = await userModel.findById(authorizationId);
        if (user) {
            const office = await officeModel.findOne({ isMainOffice: true });
            if (office) {
                return {
                    msg: getSuitableTranslations("Get Main Office Details Process Has Been Successfully !!", language),
                    error: false,
                    data: office,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function addNewOffice(officeDetails, language) {
    try {
        const office = await officeModel.findOne({ email: officeDetails.email });
        if (office) {
            return {
                msg: getSuitableTranslations("Sorry, This Email Is Already Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Creating Licence Request New Office Process Has Been Successfully !!", language),
            error: false,
            data: await (new officeModel(officeDetails)).save(),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function approveOffice(authorizationId, officeId, password, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findById(officeId);
                if (office) {
                    if (office.status === "approving") {
                        return {
                            msg: getSuitableTranslations("Sorry, This Office Is Already Approved !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    if (office.status === "blocking") {
                        return {
                            msg: getSuitableTranslations("Sorry, This Office Is Blocked !!", language),
                            error: true,
                            data: {
                                blockingDate: office.blockingDate,
                                blockingReason: office.blockingReason,
                            },
                        };
                    }
                    await officeModel.updateOne({ _id: officeId }, { status: "approving", approveDate: Date.now() });
                    const newEngineer = new adminModel({
                        name: office.ownerFullName,
                        email: office.email,
                        password: await hash(password, 10),
                        isEngineer: true,
                        officeId,
                    });
                    await newEngineer.save();
                    return {
                        msg: getSuitableTranslations("Approving On This Office And Create Engineer Account Process Has Been Successfully !!", language),
                        error: false,
                        data: {
                            adminId: newEngineer._id,
                            email: office.email,
                            language: office.language
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateOfficeInfo(authorizationId, officeId, newOfficeDetails, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findOneAndUpdate({ _id: officeId }, newOfficeDetails);
                if (office) {
                    return {
                        msg: getSuitableTranslations("Updating Details Process For This Office Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function blockingOffice(authorizationId, officeId, blockingReason, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findById(officeId);
                if (office) {
                    if (office.status === "pending" || office.status === "approving") {
                        await officeModel.updateOne({ _id: officeId }, {
                            blockingReason,
                            blockingDate: Date.now(),
                            status: "blocking"
                        });
                        await adminModel.updateMany({ officeId }, {
                            blockingReason,
                            blockingDate: Date.now(),
                            isBlocked: true
                        });
                        const engineer = await adminModel.findOne({ officeId, isEngineer: true });
                        return {
                            msg: getSuitableTranslations("Blocking Process For This Office Has Been Successfully !!", language),
                            error: false,
                            data: {
                                adminId: engineer._id,
                                email: engineer.email,
                                language: office.language
                            }
                        }
                    }
                    if (office.status === "blocking") {
                        return {
                            msg: getSuitableTranslations("Sorry, This Office Is Already Blocked !!", language),
                            error: true,
                            data: {},
                        }
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function cancelBlockingOffice(authorizationId, officeId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findById(officeId);
                if (office) {
                    if (office.status === "blocking") {
                        await officeModel.updateOne({ _id: officeId }, {
                            dateOfCancelBlocking: Date.now(),
                            status: "approving"
                        });
                        await adminModel.updateMany({ officeId }, {
                            dateOfCancelBlocking: Date.now(),
                            isBlocked: false
                        });
                        return {
                            msg: getSuitableTranslations("Cancel Blocking Process For This Office That Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, This Office Is Not Blocked !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function changeOfficeImage(authorizationId, officeId, newOfficeImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findOneAndUpdate({ _id: officeId }, {
                    imagePath: newOfficeImagePath,
                });
                if (office) {
                    return {
                        msg: getSuitableTranslations("Updating Office Image Process Has Been Successfully !!", language),
                        error: false,
                        data: { deletedOfficeImagePath: office.imagePath }
                    };
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                    error: true,
                    data: {}
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteOffice(authorizationId, officeId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findOne({ _id: officeId });
                if (office) {
                    if (office.status !== "pending") {
                        if (!office.isMainOffice) {
                            await officeModel.deleteOne({ _id: officeId });
                            const engineer = await adminModel.findOne({ officeId, isEngineer: true });
                            await adminModel.deleteMany({ officeId });
                            return {
                                msg: getSuitableTranslations("Deleting Office Process Has Been Successfully !!", language),
                                error: false,
                                data: {
                                    imagePath: office.imagePath,
                                    adminId: engineer._id,
                                    email: office.email,
                                    language: office.language
                                },
                            }
                        }
                        return {
                            msg: getSuitableTranslations("Sorry, Permission Denied Because This Office Is Main Office !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Office In Status: ( pending ) !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function rejectOffice(authorizationId, officeId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findOneAndDelete({ _id: officeId });
                if (office) {
                    return {
                        msg: getSuitableTranslations("Rejecting Office Process Has Been Successfully !!", language),
                        error: false,
                        data: {
                            imagePath: office.imagePath,
                            email: office.email,
                            language: office.language
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getOfficesCount,
    getAllOfficesInsideThePage,
    getOfficeDetails,
    getMainOfficeDetails,
    addNewOffice,
    approveOffice,
    updateOfficeInfo,
    blockingOffice,
    cancelBlockingOffice,
    changeOfficeImage,
    deleteOffice,
    rejectOffice,
}