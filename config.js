module.exports = {
    DB_NAME: 'mongoDB',
    DB_CERT_DIR: 'azure_database_cert/DigiCertGlobalRootCA.pem',
    ENCRYPT_SALT_ROUNDS: 10,
    UPLOAD_IMAGE: {
        OPTION: {
            FORMAT: 'png',
        },
        FOLDERS: {
            FOOD: 'foods',
        },
    },
    TOKEN: {
        TOKEN_EXPIRED_CODE: 'TokenExpiredError',
        TOKEN_EXPIRED_TIME: '1h',
    },
    HASH: {
        HASH_ALGORITHM: 'sha256',
        HASH_ENCODING: 'base64url',
    },
    RES_MESSAGES: {
        SUCCESS: {
            DB_CONNECTED: 'Successfully connected to the SQL database',

            //Food
            FOOD_ADDED: 'Food item successfully added',
            FOOD_UPDATED: 'Food item successfully updated',
            FOOD_DELETED: 'Food item successfully deleted',

            //Order
            ORDER_ADDED: 'Order item successfully added',
            ORDER_STATUS_UPDATED: 'Order status updated successfully',
            ORDER_CANCELED: 'Order successfully canceled',
        },
        ERROR: {
            DB_CONNECTION_FAILED: 'Failed to connect to the SQL database',
            LOAD_DATA_FAILED: 'Error retrieving data',

            //Token
            TOKEN_EXPIRED: 'Token has expired',
            TOKEN_INVALID: 'Invalid token',
            TOKEN_NOT_PROVIDED: 'No token provided. Access denied',
            
            //Food
            FOOD_NOT_FOUND: 'Food item not found',
            FOOD_UPDATE_FAILED: 'Food item to update not found',
            FOOD_DELETE_FAILED: 'Food item to delete not found',
            
            //Order
            ORDER_CREATION_FAILED: 'Unable to create the order. Please try again later',
            ORDER_LOAD_FAILED: 'Failed to load the order. Please refresh and try again',
            ORDER_STATUS_UPDATE_FAILED: 'Failed to update order status. Please refresh and try again',
            ORDER_DELETE_FAILED: 'Failed to delete order. Please refresh and try again',

            //Login
            USER_LOGIN_FAILED: 'Unable to login',
            USER_LOGIN_INVALID: 'Username or password invalid',
            USER_REGISTER_FAILED: 'Unable to register',
            USER_REGISTER_USERNAME_IN_USE: 'Username is already in use',
        }
    },
}