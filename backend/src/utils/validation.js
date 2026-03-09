// src/utils/validation.js
import { body, validationResult } from 'express-validator';

export const validateChatMessage = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('website')
    .trim()
    .notEmpty()
    .withMessage('Website is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Website must be between 1 and 255 characters'),
];

export const validateClient = [
  body('website')
    .trim()
    .notEmpty()
    .withMessage('Website is required')
    .isLength({ min: 1, max: 255 }),
  body('businessType')
    .optional()
    .isLength({ max: 100 }),
  body('systemPrompt')
    .optional()
    // No hard length limit here so you can paste long, detailed prompts.
    // If you ever want a cap, add .isLength({ max: N }).
  body('tone')
    .optional()
    .isIn(['formal', 'friendly', 'sales', 'casual', 'professional']),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};
