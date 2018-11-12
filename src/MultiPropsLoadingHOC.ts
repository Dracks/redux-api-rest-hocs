
/**
 * Check if multiple props are loading
 * @param props List of props to check
 * @returns a new object with the properties of isLoading that is the merge of all the props
 */
const MultiPropsLoadingHOC = (props:string[]) => (state: any) => {
    var status = null
    var totalKeys = props.length;
    var count = props.filter((e)=>{
        return state[e] && state[e].isLoading === false
    });
    if (count.length === totalKeys){
        status = {isLoading: false, data: {}};
    } else {
        count = props.filter((e)=>{
            return state[e] && state[e].isLoading === true
        })
        if (count.length >0 ){
            status = {isLoading: true};
        }
    }
    return status
}

export default MultiPropsLoadingHOC