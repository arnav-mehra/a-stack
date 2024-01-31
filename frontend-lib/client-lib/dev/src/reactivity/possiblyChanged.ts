export default function possiblyChanged(prev: any, curr: any): boolean {
    if (prev !== curr) return true; // x -> y: definitely changed.
    return (
        typeof prev === 'object'
        && typeof curr === 'object'
    );                              // object -> object: possibly changed.
}