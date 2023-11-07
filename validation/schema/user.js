const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('../commonFilterValidation');

const { USER_TYPES } = require('../../constants/authConstant');
const convertObjectToEnum = require('../../utils/convertObjectToEnum');

const createSchema = joi.object({
  username: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  userType: joi.number().integer().allow(0),
  mobileNo: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  ssoAuth: joi.object({
    googleId:joi.string(),
    linkedinId:joi.string()
  })
}).unknown(true);

const updateSchema = joi.object({
  username: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  userType: joi.number().integer().allow(0),
  mobileNo: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  ssoAuth: joi.object({
    googleId:joi.string(),
    linkedinId:joi.string()
  }),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
let filterValidationSchema = joi.object({
  options: options,
  ...Object.fromEntries(keys.map(key => [key, joi.object({
    username: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
    password: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
    email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
    name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
    isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
    userType: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
    mobileNo: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
    isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
    ssoAuth: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
    id: joi.any()
  }).unknown(true),])),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
}).unknown(true);

module.exports = {
  createSchema,
  updateSchema,
  filterValidationSchema
};