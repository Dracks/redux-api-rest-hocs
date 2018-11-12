import React, { Component } from "react";
import { ComponentType } from "react";


type EnrichFn<T> = (prop:T)=>ChainFn

type ChainData = {
    property: string,
    withInitialize: (c:ComponentType)=>ComponentType
    withLoading: (c:ComponentType)=>ComponentType
    withError: (c:ComponentType)=>ComponentType
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
    build: (p:ComponentType)=>ComponentType
}

export const IdentityCreator = (EndComponent:ComponentType)=>EndComponent


const buildSetProperty = (curr: ChainData):EnrichFn<string>=>(data)=>(builder({
    ...curr,
    property:data
}));

const buildSetInitialize = (curr: ChainData)=>(initProp:string)=>(builder({
    ...curr,
    withInitialize:  (EndComponent:ComponentType)=>(props:any)=>{
        let property = curr.property
        let data = props[property]
        if (data && (data.data || data.isLoading)){
            return <EndComponent {...props} />
        } else {
            if (props[initProp]){
                props[initProp](props)
                const newProps = {
                    ...props,
                    [property]: {isLoading: true}
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
    withLoading: (EndComponent:ComponentType)=>(props:any)=>{
        const value = props[curr.property]
        if (value && value.isLoading){
            return <LoadingComponent />
        } else {
            return <EndComponent {...props}/>
        }
    }
}))

const buildWithError = (curr: ChainData)=>(ErrorComponent: ComponentType)=>(builder({
    ...curr,
    withLoading: (EndComponent:ComponentType)=>(props:any)=>{
        const value = props[curr.property]
        if (value && value.error){
            return <ErrorComponent {...props}/>
        } else {
            return <EndComponent {...props}/>
        }
    }
}))

const buildCreateComponent = ({property, withLoading, withInitialize}: ChainData)=> (Component: ComponentType):ComponentType=>{
    let end = (props:any)=>{
        let data = props[property]
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
    return withInitialize(withLoading(end));
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