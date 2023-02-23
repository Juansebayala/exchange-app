/// <reference types="Cypress" />

const URL = "127.0.0.1:8080";

describe("Exchange App", () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  describe("Verifica errores", () => {
    it("Aparece error al no seleccionar una fecha", () => {
      cy.get("#buscar-conversiones").click();
      cy.get("#mensaje-error div")
        .should("be.visible")
        .should("have.text", "Debes seleccionar una fecha");
    });

    it("Aparece error al agregar menos de una moneda como cantidad", () => {
      cy.get("#cantidad-moneda").clear().type("-25");
      cy.get("#fecha-conversion").type("2023-02-22");
      cy.get("#buscar-conversiones").click();
      cy.get("#mensaje-error div")
        .should("be.visible")
        .should(
          "have.text",
          "La cantidad de monedas a convertir debe ser de al menos 1"
        );
    });

    it("Aparece mensaje de error al no poder buscar las conversiones", () => {
      cy.intercept("GET", "**/timeseries?*", { statusCode: 500 });
      realizarConversion(fechaConversion);
      cy.get("#mensaje-error-carga div").should("be.visible");
    });
  });

  let fechaConversion = "2023-02-22";

  describe("Realiza conversiones", () => {
    it("Aparecen las conversiones", () => {
      realizarConversion(fechaConversion);
      cy.get("#resultados-intercambio")
        .find(".tarjeta")
        .should("have.length.above", 0);
    });
    it("Al seleccionar una segunda conversion no se superponen los resultados", () => {
      realizarConversion(fechaConversion);
      const cantidadTarjetas = 169;
      cy.get("#resultados-intercambio")
        .find(".tarjeta")
        .should("have.length", cantidadTarjetas);
      fechaConversion = "2023-02-21";
      realizarConversion(fechaConversion);
      cy.get("#resultados-intercambio")
        .find(".tarjeta")
        .should("have.length", cantidadTarjetas);
    });
  });
});

function realizarConversion(fechaConversion) {
  cy.get("#moneda").select("USD");
  cy.get("#cantidad-moneda").clear().type("1000");
  cy.get("#fecha-conversion").type(fechaConversion);
  cy.get("#buscar-conversiones").click();
}
