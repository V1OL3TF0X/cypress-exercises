/// <reference types="cypress" />

const restaurants = [
    'Chick-fil-A',
    'McDonalds',
    'In-N-Out',
    'KFC',
    'Jack In The Box',
    'Jamba Juice',
    'Starbucks',
    'Dairy Queen',
    'Burger King',
    'Chipotle',
    'Taco Bell',
    'Five Guys',
    'Sonic',
    'Subway',
    'Panera Bread',
];

const properties = [
    'name',
    'whereToOrder',
    'description',
    'secret',
    'ingredients',
    'popularity',
    'price',
    'howToOrder',
];

const ratings = [1, 2, 3, 4, 5, 6, 7];

describe('Secret Menu Items', () => {
    beforeEach(() => {
        cy.visit('/secret-menu');
    });

    it('should exist have the title on the page', () => {
        cy.get('h1').should('contain', 'Secret Menu Items');
    });
    for (const property of properties) {
        it(`should have a column for ${property}`, () => {
            cy.get(`#${property}-column`);
        });
        it(`should hide ${property} column when unchecked`, () => {
            cy.get(`#show-${property}`).uncheck();
            cy.get(`#${property}-column`).should('be.hidden')
        });
    }
});
describe('Restaurant filter', () => {
    beforeEach(() => {
        cy.visit('/secret-menu');
        cy.get('#restaurant-visibility-filter').as('restaurant-filter')
    })
    for (const restaurant of restaurants) {
        it(`should only show items from ${restaurant} when it's selected`, () => {
            cy.get('@restaurant-filter').select(restaurant);
            cy.get('td.whereToOrder').each(place => {
                cy.wrap(place).contains(restaurant)
            });
        });
    }
});
describe('Rating filter', () => {
    beforeEach(() => {
        cy.visit('/secret-menu');
        cy.get('#minimum-rating-visibility').as('rating-filter')
    })
    for (const rating of ratings) {
        it(`should only show items above or equal to ${rating} when it's selected as minimum rating`, () => {
            cy.get('@rating-filter').invoke('val', rating).trigger('input');
            cy.get('td.popularity').each(orderRating => {
                cy.wrap(+orderRating.text()).should('not.be.lessThan', rating)
            });
        });
    }
});
