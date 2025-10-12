// Import Category And Admin Model Object

const { categoryModel, userModel, userModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function addNewCategory(authorizationId, categoryData, language) {
    try {
        const admin = await userModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const category = await categoryModel.findOne({ name: categoryData.name, officeId: admin.officeId, ...categoryData.parent && { parent: categoryData.parent } });
                if (category) {
                    return {
                        msg: getSuitableTranslations("Sorry, This Cateogry Is Already Exist !!", language),
                        error: true,
                        data: {},
                    }
                }
                if (categoryData.parent) {
                    if (!(await categoryModel.findById(categoryData.parent))) {
                        return {
                            msg: getSuitableTranslations("Sorry, This Parent Cateogry Is Not Exist !!", language),
                            error: true,
                            data: {},
                        }
                    }
                } else {
                    delete categoryData.parent;
                }
                categoryData.storeId = admin.storeId;
                return {
                    msg: getSuitableTranslations("Adding New Category Process Has Been Successfuly !!", language),
                    error: false,
                    data: await (new categoryModel(categoryData)).save(),
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

async function getAllCategories(authorizationId, filters, userType, language) {
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
            const admin = await userModel.findById(authorizationId);
            if (!admin) {
                return {
                    msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
        }
        return {
            msg: getSuitableTranslations("Get All Categories Process Has Been Successfully !!", language),
            error: false,
            data: await categoryModel.find(filters, { name: 1, storeId: 1, parent: 1, color: 1, imagePath: 1 }).populate("parent"),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoryInfo(categoryId, language) {
    try {
        const categoryInfo = await categoryModel.findById(categoryId).populate("parent");
        if (categoryInfo) {
            return {
                msg: getSuitableTranslations("Get Category Info Process Has Been Successfuly !!", language),
                error: false,
                data: categoryInfo,
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoriesCount(authorizationId, filters, language) {
    try {
        const admin = await userModel.findById(authorizationId);
        if (!admin) {
            return {
                msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        filters.storeId = admin.storeId;
        return {
            msg: getSuitableTranslations("Get Categories Count Process Has Been Successfully !!", language),
            error: false,
            data: await categoryModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllCategoriesInsideThePage(authorizationId, pageNumber, pageSize, userType, filters, language) {
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
            const admin = await userModel.findById(authorizationId);
            if (!admin) {
                return {
                    msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
        }
        return {
            msg: getSuitableTranslations("Get All Categories Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: {
                categories: await categoryModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).populate("parent"),
                categoriesCount: await categoryModel.countDocuments(filters),
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteCategory(authorizationId, categoryId, language) {
    try {
        const admin = await userModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const category = await categoryModel.findOne({
                    _id: categoryId,
                });
                if (category) {
                    if (category.storeId === admin.storeId) {
                        await categoryModel.deleteOne({
                            _id: categoryId,
                        });
                        await productModel.updateMany({ categoryId }, { category: "uncategorized" });
                        return {
                            msg: getSuitableTranslations("Deleting Category Process Has Been Successfuly !!", language),
                            error: false,
                            data: {
                                deletedCategoryImagePath: category.imagePath,
                            },
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Category Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
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

async function updateCategory(authorizationId, categoryId, newCategoryData, language) {
    try {
        const admin = await userModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const category = await categoryModel.findOne({ _id: categoryId });
                if (category) {
                    if (category.storeId === admin.storeId) {
                        if (newCategoryData.parent) {
                            if (!(await categoryModel.findById(newCategoryData.parent))) {
                                return {
                                    msg: getSuitableTranslations("Sorry, This Parent Cateogry Is Not Exist !!", language),
                                    error: true,
                                    data: {},
                                }
                            }
                        }
                        await categoryModel.updateOne({ _id: categoryId }, newCategoryData);
                        return {
                            msg: getSuitableTranslations("Updating Category Info Process Has Been Successfuly !!", language),
                            error: false,
                            data: {},
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Category Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
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
    addNewCategory,
    getAllCategories,
    getAllCategoriesInsideThePage,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    getCategoryInfo,
    deleteCategory,
    updateCategory,
}