import * as React from 'react';
import { shallow, mount } from 'enzyme';

import withLoading from './LoadingHoc';

const Content = ({dalek}:any)=><div />
const Loading = ()=><div />
describe("[hoc/LoadingHoc]", ()=>{
    let Subject:any;
    let wrapper: any;

    let check = (data: any, show:React.ComponentType)=>{
        wrapper = shallow(<Subject {...data}/>)
        expect(wrapper.find(show).length).toEqual(1);
    }

    describe("Without initializer", ()=>{
        beforeAll(()=>{
            Subject = withLoading(Content, Loading, "dalek")
        });

        it ("when we have data", ()=>{
            check({dalek: {data:"something"}}, Content)
        });

        it ("when we are loading", ()=>{
            check({dalek: {meta: {isLoading:true}}}, Loading);
        });
    });

    describe("With initializer", ()=>{
        let callback: any;
        beforeAll(()=>{
            Subject = withLoading(Content, Loading, "dalek", "run")
            callback = jest.fn()
        });

        it("Is calling the initialize", ()=>{
            check({run:callback}, Loading)
            expect(callback).toHaveBeenCalledTimes(1)
        });
    });
})