#!/usr/bin/env node
import { Command } from 'commander';

import { BIN_NAME } from './lib/constants.js';
import { createDefaultClient } from './lib/client.js';
import { formatCurrency } from './lib/format.js';
import config from './lib/config.js';

const program = new Command();
program
  .arguments('[invoiceId]', {
    invoiceId: 'TODO',
  })
  .action(run)
  .parseAsync();

/**
 * list invoices
 *  kontist-cli invoices
 *
 * get details for single invoice
 *  kontist-cli invoices [id]
 *
 * update invoice
 *  kontist-cli invoices --update [id]
 *
 * delete invoice
 *  kontist-cli invoices --delete [id]
 *
 * update invoice products
 *
 * update invoice customer
 *  get invoice customer, merge with infos, update with mutation updateInvoiceCustomer
 *  kontist-cli invoices [id] --customer
 *
 * add invoice product
 *  get products, add one, then mutation `upsertProducts`
 */

async function run(invoiceId) {
  const options = program.opts();
  const client = await createDefaultClient(config.get());

  // listing the invoices is not supported by the kontist cli

  // get invoice settings
  const invoiceSettingsQuery = `
    viewer {
      invoiceSettings {
        city
        companyName
        country
        dueDateDefaultOffset
        email
        logoUrl
        nextInvoiceNumber
        phoneNumber
        postCode
        senderName
        streetLine
        taxNumber
        vatNumber
      }
    }
  `;

  const invoiceDetailsQuery = `query FetchInvoiceDetails($id: String!) {
        viewer {
          invoice(id: $id) {
            id
            status
            invoiceNumber
            dueDate
            note
            customer {
              id
              name
              vatNumber
              taxNumber
              address
              country
          }
          products {
              id
              description
              quantity
              price
              vat
          }
      }
    }
  }`;

  const invoiceListQuery = `query listInvoices($pageNumber: Int!) {
    viewer {
      invoices(pageNumber: $pageNumber) {
        data {
          amount
          dueDate
          id
          invoiceNumber
          name
          paidAt
          status
        }
        pageInfo { hasNextPage currentPage }
      }
    }
  }`;

  const variables = invoiceId ? { id: invoiceId } : { pageNumber: 1 };
  const query = invoiceId ? invoiceDetailsQuery : invoiceListQuery;

  const output = await client.graphQL.rawQuery(query, variables);

  if (invoiceId) {
    console.log(JSON.stringify(output.viewer.invoice));
  } else {
    console.log(JSON.stringify(output.viewer.invoices.data));
  }
};
