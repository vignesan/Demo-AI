'use strict'

exports.handle = (client) => {
  // Create steps
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
client.addCarouselListResponse({
  items: [
    {
      media_url: 'https://c2.staticflickr.com/4/3512/5763418254_e2f42b2224_b.jpg',
      media_type: 'image/jpeg',
      description: 'Yosemite is a really nice place.',
      title: 'Yosemite',
      actions: [
        {
          type: 'postback',
          text: 'Visit',
          payload: {
            data: {
              action: 'visit',
              park: 'yosemite'
            },
            version: '1',
            stream: 'selectPark',
          },
        },
      ],
    },
    {
      media_url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Morning_Glory_Pool.jpg',
      media_type: 'image/jpeg',
      description: 'Yellowstone showcases geology in its most raw form.',
      title: 'Yellowstone',
      actions: [
        {
          type: 'link',
          text: 'View info',
          uri: 'https://en.wikipedia.org/wiki/Yellowstone_National_Park',
        },
      ],
    },
  ],
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

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained],
    },
  })
}
