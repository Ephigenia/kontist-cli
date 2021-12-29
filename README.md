*Project is work in progress.*

Command Line Interface ([CLI](https://en.wikipedia.org/wiki/Command-line_interface)) Tool for using the [Kontist](https://kontist.com/) API which under the hood relies on their marvelous [GraphQL API](https://kontist.dev/docs/#schema-reference) [Kontist Javascript SDK](https://kontist.dev/sdk/#using-the-sdk)

# Ideas 

- [x] get current balance (`kontist-cli balance`, returns availableBalance)
- [ ] make transaction `kontist-cli` … in progress
- [ ] standing order(s)
    - [ ] list
    - [ ] make standing order (https://kontist.dev/sdk/#create-a-standing-order)
    - [ ] update standing order (https://kontist.dev/sdk/#updating-a-standing-order)
    - [ ] delete standing order
- [ ] make timed transaction https://kontist.dev/sdk/#create-a-timed-order
- [ ] cards
    - [ ] list
    - [ ] block
    - [ ] unblock
- [ ] invoice
    - [ ] list
    - [ ] add product
    - [ ] update
- [x] money format?
- [x] currency?
- [ ] list transactions
    - [x] limit transactions
    - [ ] paginate transactions
    - [x] search transactions
- [ ] get future transactions
- [ ] categorize single transaction (https://kontist.dev/sdk/#categorize-a-transaction)
- [ ] listen for new transactions (https://kontist.dev/sdk/#subscribe-to-new-transactions)
- [ ] auto-completion

# Setup

- Valid client id for authentication. Request your client id in the API Client Management on https://kontist.dev/client-management/.
    ```
    kontist-cli login <oauth-client-id> <username>
    ```
    you’ll be promted for the password

# Examples

The command-line-tool does not include any table formater or filtering mechanism as there are other nice tools for that like [table-printer-cli](https://www.npmjs.com/package/table-printer-cli) for formatting JSON output to a nice-looking table and [jq](https://stedolan.github.io/jq/) for transforming and filtering JSON.

Both tools in combination can be used to create a nice-looking, customizable list of transactions:

    kontist-cli transactions | jq -c 'map({bookingDate,valutaDate,amount,name,iban})' | npx table-printer-cli -s

Some other command rely on the systems `LC_ALL`, `LC_TIME`, or `LC_NUMERIC` variables to format monetary values or provide additional formatted dates. The `balance` sub-command:

    $ LC_ALL=de-de kontist-cli balance
    50,20 €

# Other Projects / Bookmarks

- [Netnexus/IKontist](https://github.com/netnexus/IKontist)
- [N26 CLI (Python)](https://github.com/femueller/python-n26)
- [Teller CLI](https://github.com/sebinsua/teller-cli)
