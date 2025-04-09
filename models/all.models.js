// Import Mongoose

const { mongoose } = require("../server");

// Create Admin Schema

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isWebsiteOwner: {
        type: Boolean,
        default: false,
    },
    isMerchant: {
        type: Boolean,
        default: false,
    },
    storeId: {
        type: String,
        required: true,
    },
    permissions: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                    enum: [
                        "Add New Brand",
                        "Update Brand Info",
                        "Delete Brand",
                        "Update Order Info",
                        "Delete Order",
                        "Update Order Info",
                        "Update Order Product Info",
                        "Delete Order Product",
                        "Add New Category",
                        "Update Category Info",
                        "Delete Category",
                        "Add New Product",
                        "Update Product Info",
                        "Delete Product",
                        "Show And Hide Sections",
                        "Change Bussiness Email Password",
                        "Add New Admin",
                        "Add New Ad",
                        "Update Ad Info",
                        "Delete Ad"
                    ],
                },
                value: {
                    type: Boolean,
                    required: true,
                }
            },
        ],
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockingReason: String,
    creatingDate: {
        type: Date,
        default: Date.now,
    },
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// Create Admin Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

// Create User Schema

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    provider: {
        type: String,
        default: "same-site",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: "",
    },
    language: {
        type: String,
        enum: [
            "ar",
            "en",
            "de",
            "tr"
        ],
        default: "en"
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
    imagePath: {
        type: String,
        default: "assets/images/defaultProfileImage.png"
    }
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

// Create Account Verification Codes Schema

const accountVerificationCodesShema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdDate: Date,
    expirationDate: {
        type: Date,
        required: true,
    },
    requestTimeCount: {
        type: Number,
        default: 1,
    },
    isBlockingFromReceiveTheCode: {
        type: Boolean,
        default: false,
    },
    receiveBlockingExpirationDate: Date,
    typeOfUse: {
        type: String,
        default: "to activate account",
        enum: [
            "to activate account",
            "to reset password",
        ],
    }
});

// Create Account Verification Codes Model From Account Codes Schema

const accountVerificationCodesModel = mongoose.model("account_verification_codes", accountVerificationCodesShema);

// Create Category Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "categorie",
        default: null
    },
});

// Create Category Model From Category Schema

const categoryModel = mongoose.model("categorie", categorySchema);

// Create Order Schema

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: "",
    },
    storeId: {
        type: String,
        required: true,
    },
    totalPriceBeforeDiscount: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    totalPriceAfterDiscount: {
        type: Number,
        default: 0,
    },
    totalAmountBeforeApplyCoupon: {
        type: Number,
        default: 0,
    },
    orderAmount: {
        type: Number,
        default: 0,
    },
    checkoutStatus: {
        type: String,
        default: "Checkout Incomplete",
        enum: [
            "Checkout Incomplete",
            "Checkout Successfull"
        ],
    },
    creator: {
        type: String,
        required: true,
        enum: [
            "user",
            "guest"
        ],
    },
    paymentGateway: {
        type: String,
        required: true,
        enum: [
            "tap",
            "tabby",
            "binance"
        ],
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "shipping",
            "completed"
        ]
    },
    isApplyCoupon: {
        type: Boolean,
        default: false,
    },
    couponDetails: {
        code: {
            type: String,
            required: function () {
                return this.isApplyCoupon;
            },
        },
        discountPercentage: {
            type: Number,
            required: function () {
                return this.isApplyCoupon;
            },
        },
        storeId: {
            type: String,
            required: function () {
                return this.isApplyCoupon;
            },
        },
    },
    billingAddress: {
        firstName: {
            type: String,
            default: "none",
        },
        lastName: {
            type: String,
            default: "none",
        },
        companyName: {
            type: String,
            default: "none",
        },
        country: {
            type: String,
            default: "none",
        },
        streetAddress: {
            type: String,
            default: "none",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postalCode: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "none",
        },
    },
    shippingAddress: {
        firstName: {
            type: String,
            default: "none",
        },
        lastName: {
            type: String,
            default: "none",
        },
        companyName: {
            type: String,
            default: "none",
        },
        country: {
            type: String,
            default: "none",
        },
        streetAddress: {
            type: String,
            default: "none",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postalCode: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "none",
        },
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
            default: "none",
        },
        unitPrice: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        imagePath: {
            type: String,
            default: "none",
        },
    }],
    addedDate: {
        type: Date,
        default: Date.now,
    },
    orderNumber: Number,
    requestNotes: {
        type: String,
        default: "",
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        default: false,
        type: Boolean,
    },
    shippingCost: {
        forLocalProducts: {
            type: Number,
            default: 0,
        },
        forInternationalProducts: {
            type: Number,
            default: 0,
        }
    },
    shippingMethod: {
        forLocalProducts: {
            type: String,
            enum: ["normal", "ubuyblues"],
            required: true
        },
        forInternationalProducts: {
            type: String,
            enum: ["normal", "fast"],
            required: true
        }
    },
    language: {
        type: String,
        enum: [
            "ar",
            "en",
            "de",
            "tr"
        ],
        default: "en"
    },
});

// Create Order Model From Order Schema

const orderModel = mongoose.model("order", orderSchema);

// Create Brand Schema

const brandSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    }
});

// Create Brand Model From Brand Schema

const brandModel = mongoose.model("brand", brandSchema);

// Create Appeared Sections Schema

const appearedSectionsSchema = new mongoose.Schema({
    sectionName: String,
    isAppeared: {
        type: Boolean,
        default: false,
    },
});

// Create Appeared Sections Model From Appeared Sections Schema

const appearedSectionsModel = mongoose.model("appeared_sections", appearedSectionsSchema);

// Create Global Password Schema

const globalPasswordSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("global_password", globalPasswordSchema);

// Create Ads Schema

const adsSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["text", "image"],
    },
    content: String,
    imagePath: String,
    dateOfPost: {
        type: Date,
        default: Date.now,
    },
});

// Create Ads Model From Ads Schema

const adsModel = mongoose.model("ad", adsSchema);

module.exports = {
    mongoose,
    adminModel,
    userModel,
    accountVerificationCodesModel,
    categoryModel,
    orderModel,
    brandModel,
    appearedSectionsModel,
    globalPasswordModel,
    adsModel,
}