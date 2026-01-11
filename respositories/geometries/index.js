// Import Models Object

const { geometryModel, adminModel, userModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function addNewGeometry(authorizationId, geometryData, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const geometry = await geometryModel.findOne({ name: geometryData.name, officeId: admin.officeId, ...geometryData.parent && { parent: geometryData.parent } });
                if (geometry) {
                    return {
                        msg: getSuitableTranslations("Sorry, This Geometry Is Already Exist !!", language),
                        error: true,
                        data: {},
                    }
                }
                if (geometryData.parent) {
                    if (!(await geometryModel.findById(geometryData.parent))) {
                        return {
                            msg: getSuitableTranslations("Sorry, This Parent Geometry Is Not Exist !!", language),
                            error: true,
                            data: {},
                        }
                    }
                } else {
                    delete geometryData.parent;
                }
                geometryData.officeId = admin.officeId;
                return {
                    msg: getSuitableTranslations("Adding New Geometry Process Has Been Successfuly !!", language),
                    error: false,
                    data: await (new geometryModel(geometryData)).save(),
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
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

async function getGeometryInfo(geometryId, language) {
    try {
        const geometryInfo = await geometryModel.findById(geometryId).populate("parent");
        if (geometryInfo) {
            return {
                msg: getSuitableTranslations("Get Geometry Info Process Has Been Successfuly !!", language),
                error: false,
                data: geometryInfo,
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Geometry Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getGeometriesCount(authorizationId, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (!admin) {
            return {
                msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        filters.officeId = admin.officeId;
        return {
            msg: getSuitableTranslations("Get Geometries Count Process Has Been Successfully !!", language),
            error: false,
            data: await geometryModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllGeometriesInsideThePage(authorizationId, pageNumber, pageSize, userType, filters, language) {
    try {
        if (userType === "user") {
            const user = await userModel.findById(authorizationId);
            if (!user) {
                return {
                    msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
        } else {
            const admin = await adminModel.findById(authorizationId);
            if (!admin) {
                return {
                    msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            filters.officeId = admin.officeId;
        }
        return {
            msg: getSuitableTranslations("Get All Geometries Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: {
                geometries: await geometryModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).populate("parent"),
                geometriesCount: await geometryModel.countDocuments(filters),
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateGeometry(authorizationId, geometryId, newGeometryData, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const geometry = await geometryModel.findOne({ _id: geometryId });
                if (geometry) {
                    if (String(geometry.officeId) === String(admin.officeId)) {
                        if (newGeometryData.parent) {
                            if (!(await geometryModel.findById(newGeometryData.parent))) {
                                return {
                                    msg: getSuitableTranslations("Sorry, This Parent Geometry Is Not Exist !!", language),
                                    error: true,
                                    data: {},
                                }
                            }
                        }
                        await geometryModel.updateOne({ _id: geometryId }, newGeometryData);
                        return {
                            msg: getSuitableTranslations("Updating Geometry Info Process Has Been Successfuly !!", language),
                            error: false,
                            data: {},
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Geometry Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Geometry Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
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

async function changeGeometryImage(authorizationId, geometryId, newCategoryImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            const geometry = await geometryModel.findOneAndUpdate({ _id: geometryId }, { imagePath: newCategoryImagePath });
            if (geometry) {
                return {
                    msg: getSuitableTranslations("Updating Geometry Image Process Has Been Successfully !!", language),
                    error: false,
                    data: { deletedGeometryImagePath: geometry.imagePath }
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Geometry Is Not Exist !!", language),
                error: true,
                data: {}
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

async function deleteGeometry(authorizationId, geometryId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const geometry = await geometryModel.findOne({
                    _id: geometryId,
                });
                if (geometry) {
                    if (geometry.officeId === admin.officeId) {
                        await geometryModel.deleteOne({
                            _id: geometryId,
                        });
                        return {
                            msg: getSuitableTranslations("Deleting Geometry Process Has Been Successfuly !!", language),
                            error: false,
                            data: {
                                deletedGeometryImagePath: geometry.imagePath,
                            },
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Geometry Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Geometry Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
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
    addNewGeometry,
    getGeometryInfo,
    getGeometriesCount,
    getAllGeometriesInsideThePage,
    updateGeometry,
    changeGeometryImage,
    deleteGeometry,
}