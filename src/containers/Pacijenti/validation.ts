import * as Yup from 'yup';
import { lengthConstraintMessage, requiredMessage } from '../../constants/AppUtils';

export const yupValidationSchema: Yup.ObjectSchema = Yup.object().shape({
    ime: Yup.string()
        .required(requiredMessage)
        .min(3, lengthConstraintMessage(3))
        .max(32),
    prezime: Yup.string()
        .required(requiredMessage)
        .min(5, lengthConstraintMessage(5))
        .max(32),
    sifraZdravstvene: Yup.number()
        .required(requiredMessage)
});
