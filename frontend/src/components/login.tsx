import { useState } from "react";
import { Alert, Container, Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { userLogin } from "../redux/reducers/auth";
import { useAppDispatch, useAppSelector } from "../shared/custom-hooks";
import { MyForm } from "../shared/interfaces";
import styles from "./styles/login.module.css";
import { CustomInput, InputTypes } from "./custom-input";
import { LoadingSpinner } from "./loading-spinner";

export const Login = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<MyForm>({
    username: {
      value: "",
      valid: false,
      touched: false,
    },
    password: {
      value: "",
      valid: false,
      touched: false,
    },
  });
  const [error, setError] = useState("");

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: {
        ...form[name],
        value,
        valid: handleValidate(name, value),
        touched: true,
      },
    });
  };

  const handleValidate = (name, value) => {
    if (name === "username") {
      return value.length > 0;
    }
    if (name === "password") {
      return value.length > 0;
    }

    return true;
  };

  const isDisabled = () => {
    for (const key of Object.keys(form)) {
      if (!form[key].valid) return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled()) return;

    dispatch(
      userLogin({
        username: form.username.value,
        password: form.password.value,
      })
    )
      .unwrap()
      .catch((err) => {
        setError(err?.error);
      });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Container className={styles.container}>
            <div className={styles.loginWrapper}>
              <Image className={styles.img} fluid src="/chat.png"></Image>
              <Form className={styles.form} onSubmit={handleSubmit}>
                <CustomInput
                  inputType={InputTypes.TEXT}
                  name="username"
                  label="Username"
                  placeholder="Enter username"
                  value={form.username.value}
                  onChange={handleInputChange}
                />

                <CustomInput
                  inputType={InputTypes.TEXT}
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  value={form.password.value}
                  onChange={handleInputChange}
                />

                <div className="d-grid gap-2">
                  <Button
                    className="mt-1"
                    variant="primary"
                    type="submit"
                    disabled={isDisabled()}
                  >
                    Login
                  </Button>
                </div>
                {error && (
                  <Alert className="mt-3" variant="danger">
                    {error}
                  </Alert>
                )}
              </Form>
            </div>
            <p className="text-center mt-2">
              Don't have account, register now!
            </p>
          </Container>
        </>
      )}
    </>
  );
};
