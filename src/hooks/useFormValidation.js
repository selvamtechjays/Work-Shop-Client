import { useState } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} - Form state and handlers
 */
const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   * Updates field value and clears error for that field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  /**
   * Handle input blur
   * Marks field as touched and validates it
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    // Validate field on blur
    const error = validateField(name);
    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  /**
   * Validate a single field
   * @param {string} fieldName - Name of the field to validate
   * @returns {string} - Error message or empty string
   */
  const validateField = (fieldName) => {
    const validationFn = validationRules[fieldName];
    if (!validationFn) return '';

    const result = validationFn(values[fieldName]);
    return result.valid ? '' : result.message;
  };

  /**
   * Validate all fields
   * @returns {boolean} - True if all fields are valid
   */
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, fieldName) => {
      acc[fieldName] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return isValid;
  };

  /**
   * Handle form submission
   * @param {Function} onSubmit - Callback function to execute on valid submission
   */
  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();

    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  /**
   * Set error for a specific field
   * Useful for server-side validation errors
   */
  const setFieldError = (fieldName, errorMessage) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
  };
};

export default useFormValidation;
