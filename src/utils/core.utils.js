const getRandomNumber = (min=1, max=1000, decimal=2) => {
    const amount = Math.random() * (max - min) + min;
    return amount.toFixed(decimal)
}

const getRandomItems = (data=[], items=1) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const finalArray = shuffled.slice(0, Math.floor(items));
    return (finalArray.length === 1) ? finalArray[0] : finalArray
}

export { getRandomNumber, getRandomItems }
