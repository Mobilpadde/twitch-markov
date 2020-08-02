function Blahkov() {
    const ngrams = {}

    return {
        gen(curr) {
            let possibilites = ngrams[curr]

            if (!!!possibilites) return ""
            next = possibilites[~~(Math.random() * possibilites.length)]
            if (!!!next) return ""

            return next
        },
        update(txt) {
            const words = txt
                .replace(/[^\w+ ]/gim, "")
                .replace(/\R'/gim, " ")
                .split(" ")
                .filter(x => !!x)

            for (let i = 0; i < words.length; i++) {
                let gram = words[i]

                if (!ngrams[gram]) ngrams[gram] = []
                ngrams[gram].push(words[i + 1])
            }

            return words[0]
        }
    }
}

const bk = Blahkov()

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [window.location.hash.slice(1)]
})

client.connect()

// var synth = window.speechSynthesis
client.on("message", (channel, tags, message, self) => {
    let word = bk.update(message)

    const len = ~~(Math.random() * message.length)
    let resp = word
    for (let i = 0; i < len; i++) {
        word = bk.gen(word)
        resp += " " + word
        resp = resp.trim()
    }

    // var utterThis = new SpeechSynthesisUtterance(resp)
    // synth.speak(utterThis)
    console.log(`${tags["display-name"]}: ${message} => ${resp}`)
})
