/// <reference types="cypress" />

describe('Basic Practice', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  const item_content = 'New Task';
  describe('Adding a new item', () => {
    const addNewItem = () => {
        cy.get('[data-test="new-item-input"]').type(item_content);
        cy.get('[data-test="add-item"]').click();
    }
    it('should put a new item on the page after clicking on "Add Item"', () => {
        cy.get('[data-test="items"]').contains(item_content).should('not.exist')
        addNewItem();
        cy.get('[data-test="items"]').contains(item_content);
    });

    it('should put a new item in the "Unpacked Items" list', () => {
        addNewItem();
        cy.get('[data-test="items-unpacked"] > ul').contains(item_content);
    });

    it('should put a new item as the last item in the "Unpacked Items" list', () => {
        addNewItem();
        cy.get('[data-test="items-unpacked"] li:last-child').contains(item_content);
    });
  });

  describe('Filtering items', () => {
    const filter_content = 'Tooth';
    it('should only show items that match whatever is in the filter field', () => {
        cy.get('[data-test="filter-items"]').type(filter_content);
        cy.get('[data-test="items"] li').each((listItem) => {
            cy.wrap(listItem).contains(filter_content);
        })
    });
  });

  describe('Removing items', () => {
    describe('Remove all', () => {
      it('should remove all of the items', () => {
        cy.get('[data-test="remove-all"]').click();
        cy.get('[data-test="items-unpacked"] [data-test="items-empty-state"]')
        cy.get('[data-test="items-packed"] [data-test="items-empty-state"]')
      });
    });

    describe('Remove individual items', () => {
      it('should have a remove button on an item', () => { 
        cy.get('[data-test="items"] li').each((listItem) => {
            cy.wrap(listItem).find('[data-test="remove"]');
        })
      });

      it('should remove an item from the page', () => {
            cy.get('[data-test="items"] li').each(li => {
                cy.wrap(li).find('[data-test="remove"]').click();
                cy.wrap(li).should('not.exist');
            });
        });
    });
  });

  describe('Mark all as unpacked', () => {
    it('should empty out the "Packed" list', () => {
        cy.get('[data-test="mark-all-as-unpacked"]').click();
        cy.get('[data-test="items-packed"] li').should('have.length', 0);
    });

    it('should empty have all of the items in the "Unpacked" list', () => {
        cy.get('[data-test="items"] li').then(list => { 
            const item_no = list.length;
            cy.get('[data-test="mark-all-as-unpacked"]').click();
            cy.get('[data-test="items-unpacked"] li').should('have.length', item_no);
        });
    });
  });

  describe('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
        cy.get('[data-test="items-unpacked"] li input').first().then(item => {
            const id = item.attr('id');
            cy.wrap(item).click();
            cy.get('[data-test="items-packed"] ul').find(`#${id}`);
        });
    });
  });
});
