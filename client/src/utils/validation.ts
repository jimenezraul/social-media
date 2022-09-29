export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
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
        email: !formState.email ? "Email is required" : "",
        password: !formState.password ? "Password is required" : "",
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
        email: "Email is invalid",
      },
    });
    isValid = false;
  }
  return isValid;
};
