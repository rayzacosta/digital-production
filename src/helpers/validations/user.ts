import * as Yup from 'yup';

export const userCreateSchema = Yup.object({
  name: Yup.string().min(3).required(),
  username: Yup.string().min(3).required(),
  password: Yup.string().min(4).required(),
});
