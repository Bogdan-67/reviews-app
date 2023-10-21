import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  id_interns: Yup.array().of(
    Yup.number().required('Вы должны выбрать хотя бы одного пользователя.'),
  ),
});
export default RegisterSchema;
