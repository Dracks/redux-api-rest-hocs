import React from "react";
import { ComponentType } from "react";
import { Response } from "./Types";


type EnrichFn<T> = (prop:T)=>ChainFn

type EnrichComponentFn = <T extends {}>(c:ComponentType<T>, context: ChainData) => ComponentType<T>

type SomethingWithData<E, T extends {}> = {
    [key: string]: {
        data: E
    }
} & T

type SomethingWithoutData<E, T extends {}> = {
    [key: string]: E
} & T

type ChainData = {
    property: string,
    withInitialize: EnrichComponentFn
    withLoading: EnrichComponentFn
    withError: EnrichComponentFn
}

type ChainFn = {
    /**
     * Set the property that will load of the component
     * @param prop The property name to check
     */
    setProperty: EnrichFn<string>
    /**
     * Set the property that will be a function to initialize the data
     * @param prop The property that will have the callback to initialize the data
     */
    setInitialize: EnrichFn<string>
    /**
     * Set the component to show when you are waiting the data
     * @param prop Component to be rendered
     */
    withLoading: EnrichFn<ComponentType>
    /**
     * Set the component that should render in case of error
     * @param prop Component to be rendered
     */
    withError: EnrichFn<ComponentType>
    /**
     * Set the component that be rendered on everything ok, and return the component to be used
     */
    build: <T extends {}, E>(Component: ComponentType<SomethingWithoutData<E, T>>)=>ComponentType<SomethingWithData<E, T>>
}

export const IdentityCreator = <T extends {}>(EndComponent:ComponentType<T>)=>EndComponent


const buildSetProperty = (curr: ChainData):EnrichFn<string>=>(data)=>(builder({
    ...curr,
    property:data
}));

const buildSetInitialize = (curr: ChainData)=>(initProp:string)=>(builder({
    ...curr,
    withInitialize:  <T extends {}>(EndComponent:ComponentType<T>, context: ChainData)=>(props:any)=>{
        let property = context.property
        let data = props[property] as Response
        if (data && (data.data || data.meta.isLoading || data.error)){
            return <EndComponent {...props} />
        } else {
            if (props[initProp]){
                props[initProp](props)
                const newProps = {
                    ...props,
                    [property]: {meta:{isLoading: true} }
                }
                return <EndComponent {...newProps} />
            } else {
                return <div> Not initializer </div>
            }
        }
    }
}))

const buildWithLoading = (curr: ChainData)=>(LoadingComponent: ComponentType)=>(builder({
    ...curr,
    withLoading: <T extends {}>(EndComponent:ComponentType<T>, context: ChainData)=>(props:any)=>{
        const value = props[context.property] as Response
        if (value && value.meta && value.meta.isLoading){
            return <LoadingComponent />
        } else {
            return <EndComponent {...props}/>
        }
    }
}))

const buildWithError = (curr: ChainData)=>(ErrorComponent: ComponentType)=>(builder({
    ...curr,
    withError: <T extends {}>(EndComponent:ComponentType<T>, context: ChainData)=>(props:any)=>{
        const value = props[context.property] as Response
        if (value && value.error){
            return <ErrorComponent {...props}/>
        } else {
            return <EndComponent {...props}/>
        }
    }
}))


const buildCreateComponent = (currentData: ChainData)=>
    <T extends {}, E>(Component: ComponentType<SomethingWithoutData<E, T>>):ComponentType<SomethingWithData<E, T>>=>{
        const {property, withLoading, withInitialize, withError} = currentData
        let end = (props:any)=>{
            let data = (props as any)[property]
            if (data){
                const newProps = {
                    ...props,
                    [property]: data.data
                }
                return <Component {...newProps} />
            } else {
                return <Component {...props}/>
            }
        }
        return withInitialize(withError(withLoading(end, currentData), currentData), currentData);
}

const builder = (props:ChainData):ChainFn=>({
    setProperty: buildSetProperty(props),
    setInitialize: buildSetInitialize(props),
    withLoading: buildWithLoading(props),
    withError: buildWithError(props),
    build: buildCreateComponent(props),
})

const restChain = () => {
    return builder({
        property:"data",
        withLoading: IdentityCreator,
        withInitialize: IdentityCreator,
        withError: IdentityCreator,
    })
}

export default restChain;