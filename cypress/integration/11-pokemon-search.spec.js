/// <reference types="cypress" />

const pokemon = [
  { id: 1, name: 'Bumblesaur' },
  { id: 2, name: 'Charmer' },
  { id: 3, name: 'Turtle' },
];

describe('Pokémon Search', () => {
    beforeEach(() => {
        cy.visit('/pokemon-search');

        cy.get('[data-test="search"]').as('search');
        cy.get('[data-test="search-label"]').as('label');

        cy.intercept('/pokemon-search/api?*').as('api');
    });
    const search = 'someName';
    it('should call the API when the user types', () => {
        cy.get('@search').type('bulba');
        cy.wait('@api');
    });

    it('should update the query parameter', () => {
        cy.get('@search').type(search);
        cy.wait('@api');
        cy.location('search').should('contain', `name=${search}`)
    });

    it('should call the API with correct query parameter', () => {
        cy.get('@search').type(search);
        cy.wait('@api').its('request.url').should('contain', `name=${search}`);
    });

    it('should pre-populate the search field with the query parameter', () => {
        cy.visit('/pokemon-search', { qs: { name: search } });
        cy.get('@search').invoke('val').should('equal', search)
    });

    it('should render the results to the page', () => {
        cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');
        cy.get('@search').type('ivy');
        cy.getData('result').invoke('text').as('result-list');
        for (const p of pokemon) {
            cy.get('@result-list').should('contain', p.name);
        }
    });

    it('should link to the correct pokémon', () => {
        cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');
        cy.get('@search').type('ivy');
        cy.getData('result').invoke('text').as('result-list');
        cy.intercept('/pokemon-search/api/1', { fixture: 'bulbasaur' }).as('bulbasaur-fixture');
        cy.get('[data-test="results"] a').first().click();
        cy.fixture('bulbasaur').then(f => cy.contains(f.pokemon.name));
    });

    it('should persist the query parameter in the link to a pokémon', () => {
        cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');
        cy.get('@search').type(search);
        cy.get('[data-test="results"] a').each(link => {
            expect(link.attr('href')).to.contain(`name=${search}`)
        })
    });

    it('should bring you to the route for the correct pokémon', () => {
        const pokemon_url = '/pokemon-search/api/1';
        cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');
        cy.intercept(pokemon_url, { fixture: 'bulbasaur' }).as('bulbasaur-fixture');
        cy.get('@search').type(search);
        cy.get('[data-test="results"] a').first().click();
        cy.wait('@bulbasaur-fixture');
        cy.location('pathname').should('contain', pokemon_url)
    });

    it('should immediately fetch a pokémon if a query parameter is provided', () => {
        cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
        cy.visit({ url: '/pokemon-search', qs: { name: search } });
        cy.wait('@stubbed-api').its('response.url').should('contain', `name=${search}`);
    });
});
