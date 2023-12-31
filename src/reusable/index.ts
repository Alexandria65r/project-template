
export const devENV = process.env.NODE_ENV !== 'production'
export const protocal = devENV ? 'http://' : 'https://'
export const host = devENV ? 'http://localhost:3000' : 'https://schooyard.vercel.app'

export const REUSABLE_POPPER = {
    FilesOptions: {
        component: 'FilesOptions',
        popperId: 'files_options_popper',
        placement: 'top'
    },
    ReactToMessage: {
        component: 'ReactToMessage',
        popperId: 'react_to_message_popper',
        placement: 'bottom-start'

    },
    MessageMoreOptions: {
        component: 'MessageMoreOptions',
        popperId: 'message_more_options_popper',
        placement: 'right-start'
    },
    TestCardOptions: {
        component: 'TestCardOptions',
        popperId: 'test-card-options',
        placement: 'auto'
    },

}

export const CSS_PROPERTIES = {
    shadow: '0 1px 3px 0 #ccc',
    radius10: 10,
    radius5: 10,
}

export const pageCartegories = ['music', 'Gaming', 'comedy', 'education','startups']


export const PUSHMEPAL_AUTH_TOKEN = 'PUSHMEPAL_AUTH_TOKEN'