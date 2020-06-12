import * as Yup from 'yup';
import { lengthConstraintMessage, requiredMessage } from '../../constants/AppUtils';

export const yupValidationSchema: Yup.ObjectSchema = Yup.object().shape({
    naziv: Yup.string()
        .required(requiredMessage)
        .min(6, lengthConstraintMessage(6))
        .max(32),
    password: Yup.string()
        .required(requiredMessage)
        .min(6, lengthConstraintMessage(6))
        .max(32),
    email: Yup.string()
        .required(requiredMessage)
        .min(6, lengthConstraintMessage(6))
        .max(32),
    ime: Yup.string()
        .required(requiredMessage)
        .min(6, lengthConstraintMessage(6))
        .max(32),
    prezime: Yup.string()
        .required(requiredMessage)
        .min(6, lengthConstraintMessage(6))
        .max(32),
    brojDozvole: Yup.number().required(requiredMessage),
});
