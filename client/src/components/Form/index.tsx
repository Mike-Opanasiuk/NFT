import React from 'react';

interface FormComponentProps {
    onFinish: (values: {
        [key: string]: string;
    }) => void;
    children: JSX.Element | JSX.Element[]
}

export const FormComponent = ({ onFinish, children } : FormComponentProps) => {
    const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const values : any = {};

        data.forEach((value, key) => {
            values[key] = value;
        });

        onFinish(values);
    }

    return <form  onSubmit={handleSubmitForm}>{children}</form>;
};