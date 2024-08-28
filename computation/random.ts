// Generate a method to pick multiple elements from an array
export function randomList<T>(array: T[], count: number = 1): T[] {
    const result = [];
    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * array.length);
        result.push(array[index]);
    }
    return result;
}
