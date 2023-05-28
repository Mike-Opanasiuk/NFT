import React from "react"
import "./Alert.scss"

export const Alert = ({ message }: {
    message: string
}) => {
    return (
        <div className="alert alert-dismissible alert-danger abs-pos">
            <strong>{message}</strong>
        </div>
    )
}