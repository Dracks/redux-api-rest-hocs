export type Response = {
    meta: {
        isLoading: boolean,
        url?: string
    }
    data?: any
    error?: any
}

export type IErrorProps = {
    url: string,
    error: {
        code: number,
        description: string
    }
}