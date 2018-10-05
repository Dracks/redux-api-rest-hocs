import * as React from 'react'
import { Response } from './Types';

type PropsType = {className?: string};

export default function withLoading<T extends PropsType, L extends PropsType>(WrappedComponent: React.ComponentType<T>, Loading: React.ComponentType<L> , dataName: keyof T, initialize?: keyof T) {
    return  (props:T)=> {
        var data :Response = props[dataName] as any;
        if (data){
            if (!data.isLoading){
                var newValue: T = {} as any;
                newValue[dataName]= data.data;
                var newProps = Object.assign({}, props, newValue);
                return <WrappedComponent {...newProps} />
            }
        } else {
            if (initialize){
                let i : (props:T)=>void = props[initialize] as any;
                i(props)
            } else {
                return <div></div>;
            }
        }
        return <Loading className={props.className} />
    }
}

export const extractData=(data: Response) =>{
    return data ? data.data: undefined;
}