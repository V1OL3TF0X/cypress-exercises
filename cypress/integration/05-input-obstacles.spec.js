/// <reference types="cypress" />

describe('Input obstacles', () => {
  beforeEach(() => {
    cy.visit('/obstacle-course');
  });

  it('should input text into the input field', () => {
    const thought = 'Ravioli are a form of pop tart.';

    cy.get('[data-test="text-input"]').type(thought);
    cy.get('[data-test="text-result"]').contains(thought);
  });

  it('should control a select input', () => {
    const index = 2;
    cy.get('[data-test="select-input"]').as('select').select(index);
    cy.get('@select').find(`option:nth-of-type(${index + 1})`).invoke('val').then((v) => {
    cy.get('[data-test="select-result"]').contains(v);
    })
  });

  it('should find and control a checkbox input', () => {
    cy.get('[data-test="checkbox-result"]').as('multichoice-result').contains('(None)');
    cy.get('[data-test="checkbox-tomato"]').click().invoke('val').then(v => {
        cy.get('@multichoice-result').contains(v);
    })
  });

  it('should find and control a radio input', () => {
    cy.get('[data-test="radio-ringo"]').click().invoke('val').then(v => {
        cy.get('[data-test="radio-result"]').contains(v);
    })
  });

  it('should find and control a color input', () => {
    const randomColor = '#f4523a';
    cy.get('[data-test="color-input"]').invoke('val', randomColor).trigger('input');
    cy.get('[data-test="color-result"]').contains(randomColor);
  });

  it('should find and control a date input', () => {
    const randomDate = '2137-04-20';
    cy.get('[data-test="date-input"]').type(randomDate);
    cy.get('[data-test="date-result"]').contains(randomDate);
  });

  it('should find and control a range input', () => {
      const rangeValue = 10;
    cy.get('[data-test="range-input"]').invoke('val', rangeValue).trigger('input');
    cy.get('[data-test="range-result"]').contains(rangeValue);
  });

  it('should find and control a file input', () => {
      const fileName = 'randomFile.pdf'
    /* not available in this version of cypress
      cy.get('[data-test="file-input"]').selectFile({
        contents: 'ashjkdlaskjdhksajd',
        fileName,
        mimeType: 'text/plain',
        lastModified: Date.now(),
    });
    cy.get('[data-test="file-result"]').contains(fileName);
    */
  });
});
