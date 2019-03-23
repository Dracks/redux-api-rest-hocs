import React from 'react'
import { Response } from './Types';

type PropsType = {};
type LoadingProps = { className?: string}

export default function withLoading<T extends PropsType, L extends LoadingProps>(WrappedComponent: React.ComponentType<T>, Loading: React.ComponentType<L> , dataName: keyof T, initialize?: string) {
    return  (props:T)=> {
        var data :Response = props[dataName] as any;
        if (data){
            if (!data.meta || !data.meta.isLoading){
                var newValue: T = {} as any;
                newValue[dataName]= data.data;
                var newProps = Object.assign({}, props, newValue);
                return <WrappedComponent {...newProps} />
            }
        } else {
            if (initialize){
                let i : (props:T)=>void = (props as any)[initialize] as any;
                i(props)
            } else {
                return <div></div>;
            }
        }
        let p = { className: (props as any).className} as L
        return <Loading {...p} />
    }
}

export const extractData=(data: Response) =>{
    return data ? data.data: undefined;
}