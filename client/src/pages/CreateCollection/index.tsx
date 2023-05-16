import { Navigate } from "react-router-dom";
import { createActionAsync } from "../../store/reducers/collections";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { FormComponent } from "../../components/Form";
import { Spinner } from "../../components/Spinner";

export const CreateCollection = () => {

    const user = useAppSelector(state => state.accountSlice.user);
    const status = useAppSelector(status => status.collectionSlice.status);
    const dispatch = useAppDispatch();

    const onClickHandle = (data: any) => {
        // console.log(data);
        // return <Navigate to="/" />;
        dispatch(createActionAsync(data));
    }
    
    if (!user) {
        return <Navigate to="/" />;
    }
    
    if(status === 'fulfilled') {
        return <Navigate to="/" />;
    };

    return (
        <FormComponent onFinish={onClickHandle}>
            <div className="container">
                <div className="row">
                    <div className="col-4 offset-4">
                        <div className="form-group">
                            <label
                                htmlFor="name"
                                className="form-label mt-4"
                            >
                                Collection to create
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Enter collection name"
                            />
                        </div>
                    </div>
                    <div className="col-4 offset-4 mt-5">
                        <button
                            type="submit"
                            className="btn btn-outline-dark col-12"
                        >
                            {status === 'pending' ? (
                                <Spinner></Spinner>
                            ) : (
                                <span>Create</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </FormComponent>
    );
}