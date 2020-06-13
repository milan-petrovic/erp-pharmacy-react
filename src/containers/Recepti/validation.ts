import * as Yup from 'yup';
import { lengthConstraintMessage, requiredMessage } from '../../constants/AppUtils';

export const yupValidationSchema: Yup.ObjectSchema = Yup.object().shape({
    sadrzaj: Yup.string()
        .required(requiredMessage)
        .min(5, lengthConstraintMessage(5))
        .max(255),
    nazivUstanove: Yup.string()
        .required(requiredMessage)
        .min(5, lengthConstraintMessage(5))
        .max(40),
});
