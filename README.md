*Project is work in progress.*

Command Line Interface ([CLI](https://en.wikipedia.org/wiki/Command-line_interface)) Tool for using the [Kontist](https://kontist.com/) API which under the hood relies on their marvelous [GraphQL API](https://kontist.dev/docs/#schema-reference) [Kontist Javascript SDK](https://kontist.dev/sdk/#using-the-sdk)

# Ideas 

- [x] get current balance (`kontist-cli balance`, returns availableBalance)
- [ ] make transaction `kontist-cli` … in progress
- [ ] make timed transaction https://kontist.dev/sdk/#create-a-timed-order
- [x] money format?
- [x] currency?
- [ ] list transactions
    - [ ] limit transactions
    - [ ] paginate transactions
    - [x] search transactions
- [ ] get future transactions
- [ ] categorize single transaction (https://kontist.dev/sdk/#categorize-a-transaction)
- [ ] listen for new transactions (https://kontist.dev/sdk/#subscribe-to-new-transactions)

# Setup

- Valid client id for authentication. Request your client id in the API Client Management on https://kontist.dev/client-management/.
    ```
    kontist-cli login -c <oauth-client-id> -u <username> -p <password>
    ```

# Examples

- [table-printer-cli](https://www.npmjs.com/package/table-printer-cli)
- [jq](https://stedolan.github.io/jq/)

    kontist-cli transactions | jq -c 'map({bookingDate, valutaData,amount,name,iban})' | npx table-printer-cli -s

# Other Projects / Bookmarks

- [Netnexus/IKontist](https://github.com/netnexus/IKontist)
- [N26 CLI (Python)](https://github.com/femueller/python-n26)
- [Teller CLI](https://github.com/sebinsua/teller-cli)
