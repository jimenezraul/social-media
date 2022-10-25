export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

// name regex
export const validNameRegex = RegExp(/^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/);

//password regex
export const validPasswordRegex = RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
);

export const validation = (
  formState: FormState,
  setFormState: SetFormState
) => {
  let isValid = true;
  if (!formState.email || !formState.password) {
    setFormState({
      ...formState,
      error: {
        email: !formState.email ? 'Email is required' : '',
        password: !formState.password ? 'Password is required' : '',
      },
    });
    isValid = false;
    return isValid;
  }
  if (!validEmailRegex.test(formState.email)) {
    setFormState({
      ...formState,
      error: {
        ...formState.error,
        email: 'Email is invalid',
      },
    });
    isValid = false;
  }
  return isValid;
};

export const registerValidation = (
  formState: RegisterFormState,
  setFormState: RegisterSetFormState
) => {
  let isValid = true;
  if (
    !formState.given_name ||
    !formState.family_name ||
    !formState.email ||
    !formState.password ||
    !formState.confirm_password
  ) {
    setFormState({
      ...formState,
      error: {
        given_name: !formState.given_name && 'First name is required',
        family_name: !formState.family_name && 'Last name is required',
        email: !formState.email && 'Email is required',
        password: !formState.password && 'Password is required',
        confirm_password:
          !formState.confirm_password && 'Confirm password is required',
      },
    });
    isValid = false;
    return isValid;
  }

  if (!validNameRegex.test(formState.given_name)) {
    setFormState({
      ...formState,
      error: {
        ...formState.error,
        given_name: 'First name is invalid',
      },
    });
    isValid = false;
  }

  if (!validNameRegex.test(formState.family_name)) {
    setFormState({
      ...formState,
      error: {
        ...formState.error,
        family_name: 'Last name is invalid',
      },
    });
    isValid = false;
  }

  if (!validEmailRegex.test(formState.email)) {
    setFormState({
      ...formState,
      error: {
        ...formState.error,
        email: 'Email is invalid',
      },
    });
    isValid = false;
  }

  // check that password and confirm password match
  if (formState.password !== formState.confirm_password) {
    setFormState({
      ...formState,
      error: {
        ...formState.error,
        password: 'Passwords do not match',
        confirm_password: 'Passwords do not match',
      },
    });
    isValid = false;
  }

  if (!validPasswordRegex.test(formState.password)) {
    setFormState({
      ...formState,
      error: {
        ...formState.error,
        password:
          'Password is invalid (min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)',
      },
    });
    isValid = false;
  }

  return isValid;
};
