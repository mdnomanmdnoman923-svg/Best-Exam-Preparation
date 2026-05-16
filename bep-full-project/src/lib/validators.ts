// bep-full-project/src/lib/validators.ts

export type ValidationResult = string | null;

export type Validator<T = string> = (value: T) => ValidationResult;

export interface ValidationRule<T = string> {
  validator: Validator<T>;
  message?: string;
}

export const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export const PHONE_REGEX =
  /^(?:\+?88)?01[3-9]\d{8}$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const USERNAME_REGEX =
  /^[a-zA-Z0-9_]{3,24}$/;

export const SLUG_REGEX =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const NAME_REGEX =
  /^[A-Za-zÀ-ÿঀ-৿][A-Za-zÀ-ÿঀ-৿'’.\-\s]{1,79}$/;

export const URL_REGEX =
  /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

export const OTP_REGEX =
  /^\d{4,8}$/;

export const HEX_COLOR_REGEX =
  /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

export const BDT_AMOUNT_REGEX =
  /^\d+(\.\d{1,2})?$/;

export const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;

export const FIREBASE_PATH_REGEX =
  /^(?!\/)(?!.*\/\/)(?!.*\.\.)([\w\-./]+)$/;

export function isEmpty(
  value?: string | null,
): boolean {
  return !value || value.trim().length === 0;
}

export function isEmail(
  value: string,
): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function isPhoneNumber(
  value: string,
): boolean {
  const normalized = normalizeBangladeshPhone(value);
  return PHONE_REGEX.test(normalized);
}

export function isStrongPassword(
  value: string,
): boolean {
  return PASSWORD_REGEX.test(value);
}

export function isUsername(
  value: string,
): boolean {
  return USERNAME_REGEX.test(value.trim());
}

export function isSlug(
  value: string,
): boolean {
  return SLUG_REGEX.test(value.trim());
}

export function isName(
  value: string,
): boolean {
  return NAME_REGEX.test(value.trim());
}

export function isUrl(
  value: string,
): boolean {
  return URL_REGEX.test(value.trim());
}

export function isOtp(
  value: string,
): boolean {
  return OTP_REGEX.test(value.trim());
}

export function isHexColor(
  value: string,
): boolean {
  return HEX_COLOR_REGEX.test(value.trim());
}

export function isBangladeshCurrencyAmount(
  value: string,
): boolean {
  return BDT_AMOUNT_REGEX.test(value.trim());
}

export function isFirebasePath(
  value: string,
): boolean {
  return FIREBASE_PATH_REGEX.test(value.trim());
}

export function normalizeBangladeshPhone(
  value: string,
): string {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('880')) {
    return digits.replace(/^880/, '01');
  }

  if (digits.startsWith('01')) {
    return digits;
  }

  if (digits.startsWith('1') && digits.length === 11) {
    return `0${digits}`;
  }

  return digits;
}

export function toBangladeshE164(
  value: string,
): string {
  const normalized = normalizeBangladeshPhone(value);

  if (!PHONE_REGEX.test(normalized)) {
    return value;
  }

  return `+88${normalized}`;
}

export function sanitizeText(
  value?: string | null,
): string {
  if (!value) return '';
  return value.trim().replace(/\s+/g, ' ');
}

export function sanitizeName(
  value?: string | null,
): string {
  return sanitizeText(value)
    .replace(/[<>]/g, '')
    .slice(0, 80);
}

export function sanitizeEmail(
  value?: string | null,
): string {
  return sanitizeText(value).toLowerCase();
}

export function sanitizeUsername(
  value?: string | null,
): string {
  return sanitizeText(value).toLowerCase().replace(/[^a-z0-9_]/g, '');
}

export function sanitizeSlug(
  value?: string | null,
): string {
  return sanitizeText(value)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0980-\u09FF]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function sanitizePhone(
  value?: string | null,
): string {
  if (!value) return '';
  return normalizeBangladeshPhone(value);
}

export function validateRequired(
  value: unknown,
  label = 'This field',
): ValidationResult {
  if (
    value === null ||
    value === undefined
  ) {
    return `${label} is required.`;
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return `${label} is required.`;
  }

  if (Array.isArray(value) && value.length === 0) {
    return `${label} is required.`;
  }

  return null;
}

export function validateMinLength(
  value: string,
  min: number,
  label = 'Value',
): ValidationResult {
  const safeValue = value ?? '';
  if (safeValue.trim().length < min) {
    return `${label} must be at least ${min} characters.`;
  }
  return null;
}

export function validateMaxLength(
  value: string,
  max: number,
  label = 'Value',
): ValidationResult {
  const safeValue = value ?? '';
  if (safeValue.trim().length > max) {
    return `${label} must be at most ${max} characters.`;
  }
  return null;
}

export function validateEmail(
  value: string,
  label = 'Email',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isEmail(value)) return `Please enter a valid ${label.toLowerCase()}.`;
  return null;
}

export function validatePhone(
  value: string,
  label = 'Phone number',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isPhoneNumber(value)) {
    return `Please enter a valid ${label.toLowerCase()} (01XXXXXXXXX).`;
  }
  return null;
}

export function validatePassword(
  value: string,
  minLength = 8,
  label = 'Password',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;

  if (value.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }

  if (!/[a-z]/.test(value)) {
    return `${label} must include at least one lowercase letter.`;
  }

  if (!/[A-Z]/.test(value)) {
    return `${label} must include at least one uppercase letter.`;
  }

  if (!/\d/.test(value)) {
    return `${label} must include at least one number.`;
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return `${label} must include at least one special character.`;
  }

  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
  label = 'Password confirmation',
): ValidationResult {
  if (isEmpty(confirmPassword)) {
    return `${label} is required.`;
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
}

export function validateUsername(
  value: string,
  label = 'Username',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isUsername(value)) {
    return `${label} must be 3-24 characters and use only letters, numbers, and underscores.`;
  }
  return null;
}

export function validateSlug(
  value: string,
  label = 'Slug',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isSlug(value)) {
    return `${label} must contain only lowercase letters, numbers, and hyphens.`;
  }
  return null;
}

export function validateName(
  value: string,
  label = 'Name',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isName(value)) {
    return `${label} looks invalid.`;
  }
  return null;
}

export function validateUrl(
  value: string,
  label = 'URL',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isUrl(value)) return `Please enter a valid ${label.toLowerCase()}.`;
  return null;
}

export function validateOtp(
  value: string,
  label = 'OTP',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isOtp(value)) return `${label} must be 4 to 8 digits.`;
  return null;
}

export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  label = 'Value',
): ValidationResult {
  if (!Number.isFinite(value)) {
    return `${label} must be a number.`;
  }

  if (value < min || value > max) {
    return `${label} must be between ${min} and ${max}.`;
  }

  return null;
}

export function validatePositiveNumber(
  value: number,
  label = 'Value',
): ValidationResult {
  if (!Number.isFinite(value)) {
    return `${label} must be a number.`;
  }

  if (value <= 0) {
    return `${label} must be greater than zero.`;
  }

  return null;
}

export function validateInteger(
  value: number,
  label = 'Value',
): ValidationResult {
  if (!Number.isFinite(value)) {
    return `${label} must be a number.`;
  }

  if (!Number.isInteger(value)) {
    return `${label} must be an integer.`;
  }

  return null;
}

export function validateBoolean(
  value: unknown,
  label = 'Value',
): ValidationResult {
  if (typeof value !== 'boolean') {
    return `${label} must be true or false.`;
  }

  return null;
}

export function validateArray(
  value: unknown,
  label = 'Value',
): ValidationResult {
  if (!Array.isArray(value)) {
    return `${label} must be an array.`;
  }

  return null;
}

export function validateFileSize(
  bytes: number,
  maxBytes: number,
  label = 'File',
): ValidationResult {
  if (!Number.isFinite(bytes)) {
    return `${label} size is invalid.`;
  }

  if (bytes > maxBytes) {
    return `${label} must be smaller than ${maxBytes} bytes.`;
  }

  return null;
}

export function validateImageFile(
  mimeType: string,
  label = 'Image',
): ValidationResult {
  const allowed = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  if (!allowed.includes(mimeType)) {
    return `${label} must be a JPG, PNG, WEBP, or GIF file.`;
  }

  return null;
}

export function validatePdfFile(
  mimeType: string,
  label = 'File',
): ValidationResult {
  if (mimeType !== 'application/pdf') {
    return `${label} must be a PDF file.`;
  }

  return null;
}

export function validateQuestionText(
  value: string,
  minLength = 10,
  maxLength = 5000,
): ValidationResult {
  const text = sanitizeText(value);

  if (text.length < minLength) {
    return `Question must be at least ${minLength} characters.`;
  }

  if (text.length > maxLength) {
    return `Question must be at most ${maxLength} characters.`;
  }

  return null;
}

export function validateOptionText(
  value: string,
  minLength = 1,
  maxLength = 500,
): ValidationResult {
  const text = sanitizeText(value);

  if (text.length < minLength) {
    return `Option text is required.`;
  }

  if (text.length > maxLength) {
    return `Option must be at most ${maxLength} characters.`;
  }

  return null;
}

export function validateAtLeastOneCorrectOption(
  options: Array<{ isCorrect?: boolean }>,
): ValidationResult {
  if (!Array.isArray(options) || options.length === 0) {
    return 'At least one option is required.';
  }

  if (!options.some((option) => Boolean(option.isCorrect))) {
    return 'At least one correct option must be selected.';
  }

  return null;
}

export function validateSingleCorrectOption(
  options: Array<{ isCorrect?: boolean }>,
): ValidationResult {
  const count = options.filter((option) => Boolean(option.isCorrect)).length;

  if (count === 0) {
    return 'Select the correct answer.';
  }

  if (count > 1) {
    return 'Only one correct option is allowed.';
  }

  return null;
}

export function validateQuestionOptions(
  options: Array<{ value?: string; isCorrect?: boolean }>,
  type: 'mcq' | 'sq' | 'cq' = 'mcq',
): ValidationResult {
  if (!Array.isArray(options) || options.length === 0) {
    return 'At least one option is required.';
  }

  const hasBlankOption = options.some((option) => isEmpty(option.value));
  if (hasBlankOption) {
    return 'All options must have text.';
  }

  if (type === 'mcq') {
    return validateSingleCorrectOption(options as Array<{ isCorrect?: boolean }>);
  }

  return null;
}

export function validateSubjectName(
  value: string,
): ValidationResult {
  return validateName(value, 'Subject name');
}

export function validateChapterName(
  value: string,
): ValidationResult {
  return validateName(value, 'Chapter name');
}

export function validateClassName(
  value: string,
): ValidationResult {
  return validateName(value, 'Class name');
}

export function validateEducationLevel(
  value: string,
): ValidationResult {
  return validateName(value, 'Education level');
}

export function validateDescription(
  value: string,
  minLength = 0,
  maxLength = 1000,
  label = 'Description',
): ValidationResult {
  const text = sanitizeText(value);

  if (text.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }

  if (text.length > maxLength) {
    return `${label} must be at most ${maxLength} characters.`;
  }

  return null;
}

export function validateTags(
  tags: string[],
  maxTags = 20,
  label = 'Tags',
): ValidationResult {
  if (!Array.isArray(tags)) {
    return `${label} must be an array.`;
  }

  if (tags.length > maxTags) {
    return `You can add up to ${maxTags} tags.`;
  }

  const invalidTag = tags.find((tag) => isEmpty(tag));
  if (invalidTag) {
    return `${label} cannot contain empty values.`;
  }

  return null;
}

export function validateDateString(
  value: string,
  label = 'Date',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Please enter a valid ${label.toLowerCase()}.`;
  }
  return null;
}

export function validateFutureDate(
  value: string,
  label = 'Date',
): ValidationResult {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Please enter a valid ${label.toLowerCase()}.`;
  }

  if (date.getTime() <= Date.now()) {
    return `${label} must be in the future.`;
  }

  return null;
}

export function validatePastDate(
  value: string,
  label = 'Date',
): ValidationResult {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Please enter a valid ${label.toLowerCase()}.`;
  }

  if (date.getTime() >= Date.now()) {
    return `${label} must be in the past.`;
  }

  return null;
}

export function validateBangladeshPhoneOrEmpty(
  value: string,
  label = 'Phone number',
): ValidationResult {
  if (isEmpty(value)) return null;
  return isPhoneNumber(value) ? null : `Please enter a valid ${label.toLowerCase()} (01XXXXXXXXX).`;
}

export function validateBangladeshAmount(
  value: string,
  label = 'Amount',
): ValidationResult {
  if (isEmpty(value)) return `${label} is required.`;
  if (!isBangladeshCurrencyAmount(value)) {
    return `${label} must be a valid number with up to 2 decimal places.`;
  }
  return null;
}

export function validateUrlOrEmpty(
  value: string,
  label = 'URL',
): ValidationResult {
  if (isEmpty(value)) return null;
  return isUrl(value) ? null : `Please enter a valid ${label.toLowerCase()}.`;
}

export function composeValidators<T = string>(
  ...rules: Array<Validator<T> | ValidationRule<T>>
): Validator<T> {
  return (value: T) => {
    for (const rule of rules) {
      const validator =
        typeof rule === 'function' ? rule : rule.validator;
      const result = validator(value);
      if (result) {
        return typeof rule === 'function' ? result : rule.message || result;
      }
    }

    return null;
  };
}

export function validateAll<T>(
  value: T,
  validators: Array<Validator<T>>,
): ValidationResult[] {
  return validators.map((validator) => validator(value));
}

export function firstValidationError(
  errors: Array<ValidationResult>,
): string | null {
  return errors.find(Boolean) || null;
}

export function hasValidationErrors(
  errors: Array<ValidationResult>,
): boolean {
  return errors.some(Boolean);
}

export function mergeValidationErrors(
  ...errorSets: Array<Array<ValidationResult>>
): string[] {
  return errorSets.flat().filter((error): error is string => Boolean(error));
}

export const validators = {
  isEmpty,
  isEmail,
  isPhoneNumber,
  isStrongPassword,
  isUsername,
  isSlug,
  isName,
  isUrl,
  isOtp,
  isHexColor,
  isBangladeshCurrencyAmount,
  isFirebasePath,
  normalizeBangladeshPhone,
  toBangladeshE164,
  sanitizeText,
  sanitizeName,
  sanitizeEmail,
  sanitizeUsername,
  sanitizeSlug,
  sanitizePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateUsername,
  validateSlug,
  validateName,
  validateUrl,
  validateOtp,
  validateNumberRange,
  validatePositiveNumber,
  validateInteger,
  validateBoolean,
  validateArray,
  validateFileSize,
  validateImageFile,
  validatePdfFile,
  validateQuestionText,
  validateOptionText,
  validateAtLeastOneCorrectOption,
  validateSingleCorrectOption,
  validateQuestionOptions,
  validateSubjectName,
  validateChapterName,
  validateClassName,
  validateEducationLevel,
  validateDescription,
  validateTags,
  validateDateString,
  validateFutureDate,
  validatePastDate,
  validateBangladeshPhoneOrEmpty,
  validateBangladeshAmount,
  validateUrlOrEmpty,
  composeValidators,
  validateAll,
  firstValidationError,
  hasValidationErrors,
  mergeValidationErrors,
};

export default validators;
