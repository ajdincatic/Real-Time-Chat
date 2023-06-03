import { useState } from "react";
import { Alert, Container, Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { MyForm } from "../shared/interfaces";
import styles from "./styles/login.module.css";
import { CustomInput, InputTypes } from "./custom-input";
import { LoadingSpinner } from "./loading-spinner";
import { routes } from "../shared/constants";
import { useNavigate } from "react-router";
import { register } from "../redux/reducers/auth";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<MyForm>({
    firstName: {
      value: "",
      valid: false,
      touched: false,
    },
    lastName: {
      value: "",
      valid: false,
      touched: false,
    },
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
  const [loading, setLoading] = useState(false);

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
    if (name === "firstName") {
      return value.length > 0;
    }
    if (name === "lastName") {
      return value.length > 0;
    }
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
    setLoading(true);

    e.preventDefault();
    if (isDisabled()) return;

    await register({
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      username: form.username.value,
      password: form.password.value,
    })
      .then(() => {
        navigate(routes.LOGIN);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Container>
            <div className={styles.wrapper}>
              <Image className={styles.img} fluid src="/chat.png"></Image>
              <Form className={styles.form} onSubmit={handleSubmit}>
                <CustomInput
                  inputType={InputTypes.TEXT}
                  name="firstName"
                  label="First name"
                  placeholder="Enter first name"
                  value={form.firstName.value}
                  onChange={handleInputChange}
                />
                <CustomInput
                  inputType={InputTypes.TEXT}
                  name="lastName"
                  label="Last name"
                  placeholder="Enter last name"
                  value={form.lastName.value}
                  onChange={handleInputChange}
                />
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
                    Register
                  </Button>
                </div>
                {error && (
                  <Alert className="mt-3" variant="danger">
                    {error}
                  </Alert>
                )}
              </Form>
            </div>
            <p
              className={styles.registerText}
              onClick={() => navigate(routes.LOGIN)}
            >
              Go back to login
            </p>
          </Container>
        </>
      )}
    </>
  );
};
