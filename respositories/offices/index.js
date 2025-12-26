// Import Order Model Object

const { officeModel, adminModel, categoryModel, productModel, userModel } = require("../../models");

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
            msg: getSuitableTranslations("Sorry, This User Is Not Found !!", language),
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
                    msg: getSuitableTranslations("Get All Stores Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        stores: await officeModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ creatingOrderDate: -1 }),
                        storesCount: await officeModel.countDocuments(filters)
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
            msg: getSuitableTranslations("Sorry, This Admin Is Not Found !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getOfficeDetails(authorizationId, officeId, language) {
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
                msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Found !!", language),
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
            const office = await officeModel.findOne({ isMainStore: true });
            if (office) {
                return {
                    msg: getSuitableTranslations("Get Main Office Details Process Has Been Successfully !!", language),
                    error: false,
                    data: office,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Found !!", language),
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
                    const newMerchant = new adminModel({
                        fullName: office.ownerFullName,
                        email: office.email,
                        password: await hash(password, 10),
                        isMerchant: true,
                        officeId,
                    });
                    await newMerchant.save();
                    return {
                        msg: getSuitableTranslations("Approving On This Office And Create Merchant Account Process Has Been Successfully !!", language),
                        error: false,
                        data: {
                            adminId: newMerchant._id,
                            email: office.email,
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
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

async function updateOfficeInfo(authorizationId, officeId, newStoreDetails, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findOneAndUpdate({ _id: officeId }, newStoreDetails);
                if (office) {
                    return {
                        msg: getSuitableTranslations("Updating Details Process For This Office Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
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
                        const merchant = await adminModel.findOne({ officeId, isMerchant: true });
                        return {
                            msg: getSuitableTranslations("Blocking Process For This Office Has Been Successfully !!", language),
                            error: false,
                            data: {
                                adminId: merchant._id,
                                email: merchant.email,
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
                    msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
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
                    msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
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

async function changeOfficeImage(authorizationId, officeId, newStoreImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const office = await officeModel.findOneAndUpdate({ _id: officeId }, {
                    imagePath: newStoreImagePath,
                });
                if (office) {
                    return {
                        msg: getSuitableTranslations("Updating Office Image Process Has Been Successfully !!", language),
                        error: false,
                        data: { deletedStoreImagePath: office.imagePath }
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
                        if (!office.isMainStore) {
                            await officeModel.deleteOne({ _id: officeId });
                            await categoryModel.deleteMany({ officeId });
                            await productModel.deleteMany({ officeId });
                            const merchant = await adminModel.findOne({ officeId, isMerchant: true });
                            await adminModel.deleteMany({ officeId });
                            return {
                                msg: getSuitableTranslations("Deleting Office Process Has Been Successfully !!", language),
                                error: false,
                                data: {
                                    filePaths: [
                                        office.coverImagePath,
                                        office.profileImagePath,
                                        office.commercialRegisterFilePath,
                                        office.taxCardFilePath,
                                        office.addressProofFilePath,
                                    ],
                                    adminId: merchant._id,
                                    email: merchant.email,
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
                    msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
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
        console.log(err);
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
                            filePaths: [
                                office.coverImagePath,
                                office.profileImagePath,
                                office.commercialRegisterFilePath,
                                office.taxCardFilePath,
                                office.addressProofFilePath,
                            ],
                            email: office.email,
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Office Is Not Found !!", language),
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