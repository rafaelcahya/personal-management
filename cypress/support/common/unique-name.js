import { faker } from '@faker-js/faker'

// Brand and product names must be unique per user, and faker's food lists are
// short, so a bare faker.food.fruit() collides with leftover rows from earlier runs.
export const uniqueName = (base) => `${base} ${faker.string.alphanumeric(6)}`
