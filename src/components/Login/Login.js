import React, { useState, useReducer, useEffect, useContext, useRef } from "react";
import Input from "../UI/Input/Input";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../context/auth-context";

//a função pode ser criada fora do escopo do componente
//essa função recebe dois argumentos

const emailreducer = (state, action) => {
    if (action.type === "USER_INPUT") {
        return { value: action.val, isValid: action.val.includes("@") };
    }

    if (action.type === "INPUT_BLUR") {
        return { value: state.value, isValid: state.value.includes("@") };
    }
    //qualquer outra action type será retornado o código abaixo
    return { value: "", isValid: false };
};

const Login = (props) => {
    const authCtx = useContext(AuthContext);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();


    const [formIsValid, setFormIsValid] = useState(false);
    //useReducer
    const [emailState, dispatchEmail] = useReducer(emailreducer, {
        value: "",
        isValid: null,
    });

    //useReducer
    const [passwordState, dispatchPassword] = useReducer(
        (state, action) => {
            if (action.type === "PASSWORD_INPUT") {
                return {
                    value: action.val,
                    isValid: action.val.trim().length > 6,
                };
            }

            if (action.type === "PASSWORD_BLUR") {
                return {
                    value: state.value,
                    isValid: state.value.trim().length > 6,
                };
            }

            return { value: "", isValid: false };
        },
        { value: "", isValid: null }
    );

    const emailChangeHandler = (event) => {
        dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    };

    const passwordChangeHandler = (event) => {
        dispatchPassword({ type: "PASSWORD_INPUT", val: event.target.value });
    };

    const validateEmailHandler = () => {
        dispatchEmail({ type: "INPUT_BLUR" });
    };

    const validatePasswordHandler = () => {
        dispatchPassword({ type: "PASSWORD_BLUR" });
    };

    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;

    useEffect(() => {
        const identifier = setTimeout(() => {
            setFormIsValid(passwordIsValid && passwordIsValid);
        }, 1000);

        return () => {
            clearTimeout(identifier);
        };
    }, [emailIsValid, passwordIsValid]);

    const submitHandler = (event) => {
        event.preventDefault();

        if(formIsValid){
            authCtx.onLogin(emailState.value, passwordState.value);
        }else if(!emailIsValid){
            emailInputRef.current.focus();
        }else{
            passwordInputRef.current.focus();
        }
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    label="E-mail"
                    isValid={emailIsValid}
                    value={emailState.value}
                    onChange={emailChangeHandler}
                    onBlur={validateEmailHandler}
                />
                <Input
                    ref={passwordInputRef}
                    id="password"
                    type="password"
                    label="Password"
                    isValid={passwordIsValid}
                    value={passwordState.value}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                />
                <div className={classes.actions}>
                    <Button
                        type="submit"
                        className={classes.btn}
                    >
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
