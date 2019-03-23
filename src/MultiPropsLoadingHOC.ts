import {Response} from './Types';
/**
 * Check if multiple props are loading
 * @param props List of props to check
 * @returns a new object with the properties of isLoading that is the merge of all the props
 */
const MultiPropsLoadingHOC = (props:string[]) => (state: {[key:string]:Response}): Response => {
    var status : Response | null = null
    var totalKeys = props.length;
    var responseList = props.map((e)=>state[e]).filter(e=>e);
    var errors = responseList.filter(e=>{
        return e.error
    })
    if (errors.length>0){
        return errors[0]
    }
    var count = responseList.filter((e)=>{
        return e.meta.isLoading === false
    });
    if (count.length === totalKeys){
        status = {meta: {isLoading: false}, data: {}};
    } else {
        count = responseList.filter((e)=>{
            return e.meta.isLoading === true
        })
        if (count.length >0 ){
            status = {meta: {isLoading: true}};
        }
    }
    return status!
}

export default MultiPropsLoadingHOC