'use strict'

exports.handle = function handle(client) {
    const sayHello = client.createStep({
        satisfied() {
            return Boolean(client.getConversationState().helloSent)
        },

        prompt() {
            client.addResponse('welcome')
            client.addResponse('provide/documentation', {
                documentation_link: 'http://docs.init.ai',
            })
            client.addResponse('provide/instructions')
            client.updateConversationState({
                helloSent: true
            })
            client.done()
        }
    })

    const untrained = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addResponse('apology/untrained')
            client.done()
        }
    })

    const handleGreeting = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addTextResponse('Hello world, I mean human')
            client.done()
        }
    })
    const handleHuman = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addTextResponse('Im good');
            client.done()
        }
    })

    const handleGoodbye = client.createStep({
        satisfied() {
            return false
        },

        prompt() {
            client.addTextResponse('See you later!')
            client.done()
        }
    })

    client.runFlow({
        classifications: {
            goodbye: 'goodbye',
            greeting: 'greeting',
            human:'human',
        },
        streams: {
            goodbye: handleGoodbye,
            greeting: handleGreeting,
            human: handleHuman,
            main: 'onboarding',
            onboarding: [sayHello],
            human: [handleHuman],
            end: [untrained],
        }
    })
}
