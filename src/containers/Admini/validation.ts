import * as Yup from 'yup';
import { lengthConstraintMessage, requiredMessage } from '../../constants/AppUtils';

export const yupValidationSchema: Yup.ObjectSchema = Yup.object().shape({
    username: Yup.string()
        .required(requiredMessage)
        .min(6, lengthConstraintMessage(6))
        .max(32),
    password: Yup.string()
        .required(requiredMessage)
        .min(8, lengthConstraintMessage(8))
        .max(32),
    email: Yup.string()
        .email()
        .required(requiredMessage)
        .min(5, lengthConstraintMessage(5))
        .max(32),
});
