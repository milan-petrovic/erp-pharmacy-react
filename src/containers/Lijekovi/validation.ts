import * as Yup from 'yup';
import { lengthConstraintMessage, requiredMessage } from '../../constants/AppUtils';

export const yupValidationSchema: Yup.ObjectSchema = Yup.object().shape({
  naziv: Yup.string()
    .required(requiredMessage)
    .min(3, lengthConstraintMessage(3))
    .max(32),
  opis: Yup.string()
    .required(requiredMessage)
    .min(5, lengthConstraintMessage(5))
    .max(255),
  kolicina: Yup.number()
    .required(requiredMessage),
  cijena: Yup.number()
    .required(requiredMessage),
  kategorija: Yup.number()
    .required(requiredMessage)
});