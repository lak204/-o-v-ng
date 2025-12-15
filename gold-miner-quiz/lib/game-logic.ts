export const GAME_DURATION = 60; // seconds per turn
export const HOOK_SPEED = 5;
export const HOOK_RETURN_SPEED_SLOW = 2;
export const HOOK_RETURN_SPEED_FAST = 8;
export const ROTATION_SPEED = 0.8;

export type ItemType = 'gold-large' | 'gold-small' | 'stone' | 'diamond' | 'mystery-bag';

export type GameItem = {
    id: string;
    type: ItemType;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    value: number; // Points awarded
    weight: number; // Affects pull speed
    rotation: number;
};

const getRandomValue = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate items with random values within ranges
export const generateItems = (): GameItem[] => {
    return [
        { id: '1', type: 'gold-large', x: 10, y: 35, value: getRandomValue(50, 100), weight: 3, rotation: 0 },
        { id: '2', type: 'diamond', x: 25, y: 40, value: getRandomValue(100, 150), weight: 1, rotation: 0 },
        { id: '3', type: 'stone', x: 20, y: 55, value: 0, weight: 5, rotation: 45 },
        { id: '4', type: 'gold-small', x: 30, y: 80, value: getRandomValue(50, 100), weight: 1, rotation: 0 },
        { id: '5', type: 'diamond', x: 70, y: 45, value: getRandomValue(100, 150), weight: 1, rotation: 0 },
        { id: '6', type: 'stone', x: 60, y: 30, value: 0, weight: 5, rotation: 10 },
        { id: '7', type: 'mystery-bag', x: 50, y: 65, value: getRandomValue(100, 200), weight: 2, rotation: 0 }, // Mystery bag can be bonus
        { id: '8', type: 'gold-large', x: 80, y: 75, value: getRandomValue(50, 100), weight: 3, rotation: 90 },
        { id: '9', type: 'stone', x: 65, y: 85, value: 0, weight: 5, rotation: 20 },
        { id: '10', type: 'diamond', x: 15, y: 75, value: getRandomValue(100, 150), weight: 1, rotation: 0 },
        { id: '11', type: 'gold-small', x: 90, y: 50, value: getRandomValue(50, 100), weight: 1, rotation: 15 },
    ];
};

export const INITIAL_ITEMS = generateItems(); // Keep for backward compatibility if needed, but better to call function
