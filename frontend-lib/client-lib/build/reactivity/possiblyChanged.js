export default function possiblyChanged(prev, curr) {
    if (prev !== curr)
        return true; // x -> y: definitely changed.
    return (typeof prev === 'object'
        && typeof curr === 'object'); // object -> object: possibly changed.
}
