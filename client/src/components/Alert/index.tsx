import "./Alert.scss"

export const Alert = ({ message }: {
    message: string
}) => {
    return (
        <div className="alert alert-dismissible alert-danger abs-pos">
            <strong>{message}</strong> 
            {/* <a href="#" className="alert-link">Change a few things up</a> and try submitting again. */}
        </div>
    )
}