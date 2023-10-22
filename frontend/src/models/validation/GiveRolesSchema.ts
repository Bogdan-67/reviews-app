import * as Yup from 'yup';

const GiveRoleSchema = Yup.object().shape({
  id_role: Yup.number().required('Обязательное поле'),
  users: Yup.array()
    .of(Yup.number())
    .required('Вы должны выбрать хотя бы одного пользователя.'),
});
export default GiveRoleSchema;
