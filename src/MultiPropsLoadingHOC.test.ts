import  MultiPropsLoadingHOC from "./MultiPropsLoadingHOC";
import { Response } from "./Types";

describe('[MultiPropsLoadingHOC', ()=>{
    const subject = MultiPropsLoadingHOC(['p1', 'p2']);
    const isLoading: Response = { meta: {isLoading: true }}
    const notLoading: Response = { meta: {isLoading: false}, data: {}}
    const withErrors: Response = {error: "Some error", meta: {isLoading: false}}


    
    it ('Basic status', ()=>{

        expect(subject({p1: isLoading, p2: notLoading})).toEqual(isLoading)
        expect(subject({p1: notLoading, p2: notLoading})).toEqual(notLoading)

        expect(subject({})).toEqual(null)
    })

    it ('WithErrors', ()=>{
        expect(subject({p1: withErrors, p2: isLoading})).toEqual(withErrors)
    })
})