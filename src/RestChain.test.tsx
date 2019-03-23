import * as React from 'react';
import { shallow, mount } from 'enzyme';

import restChain from './RestChain';

const Content = ({dalek}:any)=><div />
const Loading = ()=><div />

describe('[RestChain]', ()=>{
    let wrapper: any;

    let check = (Test: React.ComponentType, data: any, show:React.ComponentType)=>{
        wrapper = mount(<Test {...data}/>)
        expect(wrapper.find(show).length).toEqual(1);
    }

    it("Basic information", ()=>{
        let mock = jest.fn(Content)
        let Test = restChain()
            .setProperty('dalek')
            .build(mock)
        check(Test, {dalek:{data: "hi world"}}, mock)
        expect(mock).toBeCalledWith({dalek: "hi world"}, {})
    })

    it('With not loading', ()=>{
        let mock = jest.fn(Content)
        let Test = restChain()
            .setProperty('dalek')
            .withLoading(Loading)
            .build(mock)
        check(Test, {dalek:{meta: {isLoading: false}, data: "hi world"}}, mock)
        expect(mock).toBeCalledWith({dalek: "hi world"}, {})
    })

    it('With Initialize', ()=>{
        let mock = jest.fn(Loading);
        let Test = restChain()
            .setProperty('dalek')
            .withLoading(mock)
            .build(Content)
        check(Test, {dalek:{meta: {isLoading: true}, data: "hi world"}}, mock)
        expect(mock).toBeCalledWith({}, {})
    })

    it('With Initialize & no-Data', ()=>{
        let mock = jest.fn(Loading);
        let init = jest.fn();
        let Test = restChain()
            .setProperty('dalek')
            .setInitialize('init')
            .withLoading(mock)
            .build(Content)
        check(Test, {init, first:35}, mock)
        expect(init).toBeCalledWith({init, first:35});
        expect(mock).toBeCalledWith({}, {})
    })

    it('With Initialize unordered & no-Data', ()=>{
        let mock = jest.fn(Loading);
        let init = jest.fn();
        let Test = restChain()
            .setInitialize('init')
            .setProperty('dalek')
            .withLoading(mock)
            .build(Content)
        check(Test, {init, first:35}, mock)
        expect(init).toBeCalledWith({init, first:35});
        expect(mock).toBeCalledWith({}, {})
    })

    it('With Error', ()=>{
        let mock = jest.fn(Loading);
        let mockLoading = jest.fn(Loading);
        let Test = restChain()
            .setProperty('dalek')
            .withLoading(mockLoading)
            .withError(mock)
            .build(Content)

        check(Test, {dalek:{error: "Hello error"}}, mock)
        expect(mock).toBeCalledWith({dalek:{error: "Hello error"}}, {})

        check(Test, {dalek:{meta: {isLoading: true}}}, mockLoading)
        expect(mockLoading).toBeCalledWith({}, {})
    })


})