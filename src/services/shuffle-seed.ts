// shuffleWithSeed.ts
import seedrandom from "seedrandom"

export default function shuffleWithSeed<T>(arr: T[], seed: string): T[] {
    const rng = seedrandom(seed)
    const seedRand = (func: seedrandom.PRNG, min: number, max: number) => {
        return Math.floor(func() * (max - min + 1)) + min
    }
    const resp: T[] = []
    const keys = Object.keys(Array.from(new Array(arr.length)))

    for (let i = 0; i < arr.length; i++) {
        const r = seedRand(rng, 0, keys.length - 1)
        const g = keys[r]
        keys.splice(r, 1)
        resp.push(arr[Number(g)])
    }

    return resp
}