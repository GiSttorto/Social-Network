async function fn() {

    return "woooooooooo!"
}

fn().then(resp => console.log(resp))


async function fn() {
    await setTimeout(function() {
        console.log("heeey I'm setTimeout")

    }, 200)
    console.log("wooooooooooo!!")
}

fn()
