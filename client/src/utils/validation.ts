export const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

export const validation = (formState: any, setFormState:any) => {
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
      }
  
      if (!formState.email) {
        setFormState({
          ...formState,
          error: {
            ...formState.error,
            email: "Email is required",
          },
        });
        isValid = false;
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
