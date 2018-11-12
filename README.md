# Redux-rest-api-hocs
![https://travis-ci.org/Dracks/redux-api-rest-hocs.svg?branch=master](https://travis-ci.org/Dracks/redux-api-rest-hocs.svg?branch=master)

This is a list of React HOC to be used with [https://github.com/Dracks/redux-api-rest](https://github.com/Dracks/redux-api-rest)


## Sample Usage of LoadingHoc

```
import { restChain } from 'redux-api-rest-hocs'
...
let ComponentWithLoading =  restChain()
    .setProperty('propWithRestData')
    .withLoading(LoadingComponent)
    .build(Component)

```

You can check it on the RestChain.test.tsx more examples
